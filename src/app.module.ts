import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthModule } from './module/health/health.module';
import { AuthModule } from './module/auth/auth.module';
import { ApiConfigModule } from './config/api/api-config.module';
import { ApiConfigServices } from './config/api/api-config.service';
import { MongoModule } from './module/mongo/mongo.module';
import { AuthMiddleware } from '@/src/shared/middleware/header.middleware';

const modules = [HealthModule, AuthModule, ApiConfigModule, MongoModule];

@Module({
  imports: modules,
  controllers: [],
  providers: [ApiConfigServices],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AuthMiddleware to all routes
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
