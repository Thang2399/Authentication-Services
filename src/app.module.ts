import { Module } from '@nestjs/common';
import { HealthModule } from './module/health/health.module';
import { AuthModule } from './module/auth/auth.module';
import { ApiConfigModule } from './config/api/api-config.module';
import { ApiConfigServices } from './config/api/api-config.service';
import { MongoModule } from './module/mongo/mongo.module';
import { MailModule } from '@/src/config/mail/mail.module';

const modules = [HealthModule, AuthModule, ApiConfigModule, MongoModule];

@Module({
  imports: modules,
  controllers: [],
  providers: [ApiConfigServices],
})
export class AppModule {}
