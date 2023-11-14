import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthServices } from '../service/auth.service';
import { LoginWithEmailPasswordDto } from '@/src/dto/auth/login.dto';
import { SignupWithEmailDto } from '@/src/dto/auth/signup.dto';
import { ForgotPasswordDto } from '@/src/dto/auth/forgot-password.dto';
import { ResetPasswordDto } from '@/src/dto/auth/reset-password.dto';
import { AuthenticationGuard } from '@/src/shared/guard/auth.guard';
import { Response } from 'express';
import { VerifyTokenDto } from '@/src/dto/token/verify-token.dto';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('/')
export class AuthController {
  constructor(private readonly authServices: AuthServices) {}
  @ApiOperation({
    description: 'Login with email and password',
  })
  @ApiBody({
    type: LoginWithEmailPasswordDto,
  })
  @Post('/login')
  async loginWithEmailPassword(@Body() body: LoginWithEmailPasswordDto) {
    return this.authServices.loginWithEmailPassword(body);
  }

  @ApiOperation({
    description: 'Sign up with email and password',
  })
  @ApiBody({
    type: SignupWithEmailDto,
  })
  @Post('/sign-up')
  async signUpWithEmailPassword(@Body() dto: SignupWithEmailDto) {
    return this.authServices.signUpWithEmailPassword(dto);
  }

  @ApiOperation({
    description: 'Forget password send email',
  })
  @ApiBody({
    type: ForgotPasswordDto,
  })
  @Post('/forgot-password')
  async forgotPasswordSendEmail(@Body() dto: ForgotPasswordDto) {
    return this.authServices.forgotPasswordSendEmail(dto);
  }

  @ApiOperation({
    description:
      'Reset new password with reset link send from forgot password email',
  })
  @ApiBody({
    type: ResetPasswordDto,
  })
  @Post('/reset-password')
  async resetPasswordWithResetLink(@Body() dto: ResetPasswordDto) {
    return this.authServices.resetPasswordWithResetLink(dto);
  }

  @UseGuards(AuthenticationGuard)
  @ApiOperation({
    description: 'Get current user information',
  })
  @Post('/me')
  @Get('/me')
  async getCurrentUserInfo(@Req() request, @Res() res: Response) {
    const userId = request?.userId;
    const accessToken = request.accessToken;

    if (!userId || !accessToken) {
      throw new NotFoundException('Not found user');
    } else {
      const specificUser = await this.authServices.getCurrentUserInfo(userId);

      return res.status(200).json({
        ...specificUser,
        accessToken,
      });
    }
  }

  @ApiOperation({
    description:
      'Generate new accessToken and new refreshToken from the current refreshToken',
  })
  @Post('/generate/new-token')
  async generateNewAccessTokenFromRefreshToken(@Body() dto: VerifyTokenDto) {
    const { token } = dto;
    if (!token) {
      throw new UnauthorizedException();
    }
    return this.authServices.generateNewAccessTokenFromRefreshToken(dto);
  }
}
