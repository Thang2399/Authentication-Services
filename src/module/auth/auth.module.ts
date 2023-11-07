import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthServices } from './auth.service';
import { ApiConfigModule } from '../../config/api/api-config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigServices } from '../../config/api/api-config.service';
import { MailModule } from '@/src/config/mail/mail.module';

@Module({
  imports: [
    ApiConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthServices, ApiConfigServices],
})
export class AuthModule {}
