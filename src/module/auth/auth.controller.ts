import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthServices } from './auth.service';
import { LoginWithEmailPasswordDto } from '@/src/dto/auth/login.dto';
import { SignupWithEmailDto } from '@/src/dto/auth/signup.dto';
import { ForgotPasswordDto } from '@/src/dto/auth/forgot-password.dto';
import { ResetPasswordDto } from '@/src/dto/auth/reset-password.dto';

@ApiTags('Authentication')
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
    description: 'forget password send email',
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
      'reset new password with reset link send from forgot password email',
  })
  @ApiBody({
    type: ResetPasswordDto,
  })
  @Post('/reset-password')
  async resetPasswordWithResetLink(@Body() dto: ResetPasswordDto) {
    return this.authServices.resetPasswordWithResetLink(dto);
  }
}
