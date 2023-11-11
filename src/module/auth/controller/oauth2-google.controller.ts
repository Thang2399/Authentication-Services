import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthServices } from '@/src/module/auth/service/auth.service';
import { IOAuthStateComing } from '@/src/interface/state.interface';
import { Response } from 'express';

@ApiTags('Google authentication')
@Controller('/google')
export class Oauth2GoogleController {
  constructor(private readonly authServices: AuthServices) {}

  @ApiOperation({
    description: 'google authentication',
  })
  @Get('/')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Req() req) {}

  @ApiOperation({
    description: 'login with google and redirect',
  })
  @Get('/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const googleUser = await this.authServices.loginWithGoogle(req);

    const generatedTokens = await this.authServices.generateAccessRefreshToken(
      googleUser,
    );

    const { redirect_url } = <IOAuthStateComing>JSON.parse('redirect_url')
      ? JSON.parse('redirect_url')
      : '';

    if (!redirect_url) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Missing redirect url' });
    } else {
      const redirectUrl = new URL(redirect_url);
      const { accessToken, refreshToken } = generatedTokens;
      redirectUrl.searchParams.append('accessToken', accessToken);
      redirectUrl.searchParams.append('refreshToken', refreshToken);

      res.redirect(redirectUrl.toString());
    }
  }
}
