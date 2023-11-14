import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { UserServices } from '@/src/module/user/service/user.service';

@ApiTags('User API')
@Controller('/users')
export class UserController {
  constructor(private readonly userServices: UserServices) {}
}
