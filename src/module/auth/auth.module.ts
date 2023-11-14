import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthServices } from './service/auth.service';
import { ApiConfigModule } from '../../config/api/api-config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigServices } from '../../config/api/api-config.service';
import { MailModule } from '@/src/config/mail/mail.module';
import { GoogleStrategy } from '@/src/strategy/google.strategy';
import { Oauth2GoogleController } from '@/src/module/auth/controller/oauth2-google.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ApiConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    }),
    MailModule,
  ],
  controllers: [AuthController, Oauth2GoogleController],
  providers: [AuthServices, ApiConfigServices, GoogleStrategy],
})
export class AuthModule {}
