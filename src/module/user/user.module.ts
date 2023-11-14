import { Module } from '@nestjs/common';
import { UserController } from '@/src/module/user/controller/user.controller';
import { UserServices } from '@/src/module/user/service/user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserServices],
})
export class UserModule {}
