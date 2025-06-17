import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { User_Role_Enum } from '@/src/shared/enum/user.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { USER_TYPES_ENUMS } from '@/src/enum';

export class UpdateUserRoleDto {
  @ApiProperty({ default: User_Role_Enum.USER })
  @Expose()
  role: string = User_Role_Enum.USER;

  @IsEnum(USER_TYPES_ENUMS)
  @ApiProperty({
    enum: USER_TYPES_ENUMS,
    default: USER_TYPES_ENUMS.ECOMMERCE,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  userType: string;
}
