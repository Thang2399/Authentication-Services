import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '@/src/schema/user.schema';
import { ApiConfigServices } from '@/src/config/api/api-config.service';
import { SignupWithEmailDto } from '@/src/dto/auth/signup.dto';
import {
  checkTokenExpireOrNot,
  comparePassword,
  generateRandomPassword,
  getFutureTimestamp,
  hashPassword,
} from '@/src/utils';
import {
  IGoogleUser,
  IUserInterface,
} from '@/src/shared/interface/user.interface';
import { LoginWithEmailPasswordDto } from '@/src/dto/auth/login.dto';
import { HTTP_RESPONSE_MESSAGE } from '@/src/constants';
import { ForgotPasswordDto } from '@/src/dto/auth/forgot-password.dto';
import { ResetPasswordDto } from '@/src/dto/auth/reset-password.dto';
import { MailService } from '@/src/config/mail/mail.service';
import { Gender_Enum } from '@/src/shared/enum/user.enum';
import { VerifyTokenDto } from '@/src/dto/token/verify-token.dto';

@Injectable()
export class AuthServices {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private apiConfigServices: ApiConfigServices,
    private mailServices: MailService,
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

  async createUserSignUpWithSocialIfNotExit(user: IGoogleUser) {
    console.log('specificUser', user);
    const email = user.email;
    const userName = `${user.firstName} ${user.lastName}`;

    const specificUserFromDatabase = await this.userModel
      .findOne({ email })
      .exec();

    if (!specificUserFromDatabase) {
      const password = await generateRandomPassword();

      const newUserObj = {
        email,
        userName,
        password,
        gender: Gender_Enum.MALE,
        phoneNumber: '000000000',
      };

      const newUser = new this.userModel(newUserObj);
      await newUser.save();

      return newUser;
    } else {
      return specificUserFromDatabase;
    }
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
      await this.mailServices.sendEmailResetPasswordLink(
        user,
        resetPasswordToken,
      );
    }
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

  async loginWithGoogle(req) {
    const { user } = req;
    if (!user) {
      throw new NotFoundException(HTTP_RESPONSE_MESSAGE.LOGIN.USER_NOT_EXIST);
    }
    console.log('user', user);
    return await this.createUserSignUpWithSocialIfNotExit(user);
  }

  async getCurrentUserInfo(userId: string) {
    const specificUser = await this.userModel.findById(userId).exec();

    delete specificUser.password;

    return {
      _id: specificUser._id,
      userName: specificUser.userName,
      email: specificUser.email,
      gender: specificUser.gender,
      role: specificUser.role,
      phoneNumber: specificUser.phoneNumber,
      dateOfBirth: specificUser.dateOfBirth,
    };
  }

  async generateNewAccessTokenFromRefreshToken(dto: VerifyTokenDto) {
    const { token } = dto;

    try {
      const verifyToken = await this.jwtService.verifyAsync(token, {
        secret: this.apiConfigServices.getSecretKey(),
      });

      const id = verifyToken?.id;
      if (id) {
        const specificUser = await this.userModel.findById(id).exec();
        this.revokeToken(token);
        return this.generateAccessRefreshToken(specificUser);
      }
    } catch {
      throw new UnauthorizedException();
    }
  }
}
