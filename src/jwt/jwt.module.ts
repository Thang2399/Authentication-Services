import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigModule } from '@/src/config/api/api-config.module';
import { ApiConfigServices } from '@/src/config/api/api-config.service';

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
