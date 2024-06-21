import { Module } from '@nestjs/common';
import { UserController } from '@/src/module/user/controller/user.controller';
import { UserServices } from '@/src/module/user/service/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/src/schema/user.schema';
import { ApiConfigModule } from '@/src/config/api/api-config.module';
import { ApiConfigServices } from '@/src/config/api/api-config.service';

@Module({
  imports: [
    ApiConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserServices, ApiConfigServices],
})
export class UserModule {}
