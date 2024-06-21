import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { User_Role_Enum } from '@/src/shared/enum/user.enum';

export class UpdateUserRoleDto {
  @ApiProperty({ default: User_Role_Enum.USER })
  @Expose()
  role: string = User_Role_Enum.USER;
}
