// src/common/guards/auth.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigServices } from '@/src/config/api/api-config.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private apiConfigServices: ApiConfigServices,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = GqlExecutionContext.create(context).getContext().req;

    // Check the access token in the request object
    const accessToken = request.accessToken;

    // Add your logic to validate and authenticate the user using the access token
    // You might want to decode and verify the token, check if the user exists, etc.

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const verifyToken = await this.jwtService.verifyAsync(accessToken, {
        secret: this.apiConfigServices.getSecretKey(),
      });
      console.log('verifyToken', verifyToken);

      const id = verifyToken?.id;
      if (id) {
        request['userId'] = id;
        request['accessToken'] = accessToken;
        return true;
      }
    } catch {
      console.log('check run here');
      throw new UnauthorizedException();
    }
  }
}
