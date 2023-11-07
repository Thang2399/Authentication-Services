import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigServices } from '../config/api/api-config.service';
import { ApiConfigModule } from '../config/api/api-config.module';
// import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ApiConfigModule,
    JwtModule.registerAsync({
      inject: [ApiConfigServices],
      useFactory: (apiConfigService: ApiConfigServices) => ({
        secret: apiConfigService.getSecretKey(),
        signOptions: {
          expiresIn:
            apiConfigService.getBearerTokenExpireTime().accessTokenExpire,
        },
      }),
    }),
  ],
  providers: [ApiConfigServices],
  exports: [JwtModule, ApiConfigServices],
})
export class JwtAuthModule {}
