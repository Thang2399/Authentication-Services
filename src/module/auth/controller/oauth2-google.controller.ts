import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpStatus,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthServices } from '@/src/module/auth/service/auth.service';
import { IOAuthStateComing } from '@/src/shared/interface/state.interface';
import { Request, Response } from 'express';

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
  @Redirect()
  @Get('/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const googleUser = await this.authServices.loginWithGoogle(req);
    console.log('googleUser', googleUser);

    const generatedTokens = await this.authServices.generateAccessRefreshToken(
      googleUser,
    );

    const payload = req.query.state as string;

    const { redirect_url } = <IOAuthStateComing>JSON.parse(payload)
      ? JSON.parse(payload)
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
