import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { HTTP_RESPONSE_MESSAGE } from '../../constants';
import { JwtService } from '@nestjs/jwt';

// import { MailService } from '../config/mail/mail.service';
import {
  checkTokenExpireOrNot,
  comparePassword,
  getFutureTimestamp,
  hashPassword,
} from '../../utils';
import { User, UserDocument } from '../../schema/user.schema';
import { ApiConfigServices } from '../../config/api/api-config.service';
import { SignupWithEmailDto } from '../../dto/auth/signup.dto';
import { IUserInterface } from '../../interface/user.interface';
import { LoginWithEmailPasswordDto } from '../../dto/auth/login.dto';
import { ForgotPasswordDto } from '../../dto/auth/forgot-password.dto';
import { ResetPasswordDto } from '../../dto/auth/reset-password.dto';

@Injectable()
export class AuthServices {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private apiConfigServices: ApiConfigServices, // private mailServices: MailService,
  ) {}
  private revokedTokens: Set<string> = new Set();
  public revokeToken(token: string): void {
    this.revokedTokens.add(token);
  }
  public isTokenRevoked(token: string): boolean {
    return this.revokedTokens.has(token);
  }
  async createUserIfNotExit(dto: SignupWithEmailDto) {
    const password = dto.password;
    const hashedPassword = await hashPassword(password);

    const newUserObj = {
      ...dto,
      password: hashedPassword,
    };

    const newUser = new this.userModel(newUserObj);
    await newUser.save();
    const specificUser = await this.userModel
      .findOne({ email: dto.email })
      .exec();

    return await this.generateAccessRefreshToken(specificUser);
  }

  async generateAccessRefreshToken(userPayload: IUserInterface) {
    const payload = { id: userPayload.id, email: userPayload.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn:
        this.apiConfigServices.getBearerTokenExpireTime().accessTokenExpire,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn:
        this.apiConfigServices.getBearerTokenExpireTime().refreshTokenExpire,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateResetPasswordToken(user: IUserInterface) {
    const { id, userName } = user;
    if (id) {
      const payload = { id, userName };
      const resetPasswordToken = this.jwtService.sign(payload, {
        expiresIn: '1h',
      });
      const expiredTime = getFutureTimestamp();
      // await this.mailServices.sendEmailResetPasswordLink(
      //   user,
      //   resetPasswordToken,
      // );
    }
  }

  getHealthCheck(): string {
    return 'Hello World! Authen services is still alive';
  }

  async loginWithEmailPassword(dto: LoginWithEmailPasswordDto) {
    const email = dto.email.toLowerCase();
    const password = dto.password;
    const specificUser = await this.userModel.findOne({ email }).exec();
    const specificUserPassword = specificUser?.password || '';
    const comparePasswordResult = await comparePassword(
      specificUserPassword,
      password,
    );

    if (!specificUser || !comparePasswordResult) {
      throw new BadRequestException({
        message: HTTP_RESPONSE_MESSAGE.LOGIN.WRONG_USER_EMAIL_OR_PASSWORD,
      });
    } else {
      return await this.generateAccessRefreshToken(specificUser);
    }
  }

  async signUpWithEmailPassword(dto: SignupWithEmailDto) {
    const email = dto.email.toLowerCase();
    const specificUser = await this.userModel.findOne({ email }).exec();

    if (specificUser) {
      throw new BadRequestException({ message: 'Duplicate email' });
    } else {
      return await this.createUserIfNotExit(dto);
    }
  }

  async forgotPasswordSendEmail(dto: ForgotPasswordDto) {
    const { email } = dto;
    const specificUser = await this.userModel.findOne({ email }).exec();

    if (!specificUser) {
      throw new NotFoundException({
        message: HTTP_RESPONSE_MESSAGE.FORGET_RESET_PASSWORD.NOT_FOUND_EMAIL,
      });
    } else {
      await this.generateResetPasswordToken(specificUser);
    }
  }

  async resetPasswordWithResetLink(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;
    const isTokenInvalid = this.isTokenRevoked(token);
    const decodedToken = this.jwtService.verify(token);
    const id = decodedToken?.id;
    const tokenExpiredTime = decodedToken?.exp || 0;
    const isTokenNotExpired = checkTokenExpireOrNot(tokenExpiredTime);

    if (!id || !isTokenNotExpired || isTokenInvalid) {
      throw new BadRequestException({
        message: HTTP_RESPONSE_MESSAGE.FORGET_RESET_PASSWORD.TOKEN_IS_INVALID,
      });
    } else {
      const newHashedPassword = await hashPassword(newPassword);
      await this.userModel
        .findByIdAndUpdate(id, { password: newHashedPassword }, { new: true })
        .exec();
      this.revokeToken(token);
    }
  }
}
