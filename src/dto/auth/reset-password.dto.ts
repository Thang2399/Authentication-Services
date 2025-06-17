import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { USER_TYPES_ENUMS } from '@/src/enum';

export class ResetPasswordDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  token: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  newPassword: string;

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
