import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { ApiConfigServices } from '@/src/config/api/api-config.service';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    readonly apiConfigServices: ApiConfigServices, // Inject ConfigService
  ) {
    super({
      clientID: apiConfigServices.getGoogleOAuthKeys().clientId,
      clientSecret: apiConfigServices.getGoogleOAuthKeys().clientSecret,
      callbackURL: `${apiConfigServices.getAppDomain()}${apiConfigServices.getPort()}/google/redirect`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async authenticate(req: Request, options: any) {
    const stringify = JSON.stringify(req.query);
    super.authenticate(req, {
      ...options,
      state: stringify,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avatarUrl: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
