import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ApiConfigModule } from './config/api/api-config.module';
import { ApiConfigServices } from './config/api/api-config.service';

@Module({
  imports: [HealthModule, AuthModule, ApiConfigModule],
  controllers: [],
  providers: [ApiConfigServices],
})
export class AppModule {}
