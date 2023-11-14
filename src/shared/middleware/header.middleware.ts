// src/common/middleware/auth.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Access the Authorization header value
    const authorizationHeader = req.headers['authorization'];

    if (authorizationHeader) {
      // Store the value in the request object
      req['accessToken'] = authorizationHeader.startsWith('Bearer')
        ? authorizationHeader.replace('Bearer ', '')
        : authorizationHeader;

      // Pass control to the next middleware or route handler
    }

    next();
  }
}
