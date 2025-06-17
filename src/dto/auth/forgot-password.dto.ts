import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { USER_TYPES_ENUMS } from '@/src/enum';

export class ForgotPasswordDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({ required: true })
  callbackUrl: string;

  @IsEnum(USER_TYPES_ENUMS)
  @ApiProperty({
    enum: USER_TYPES_ENUMS,
    default: USER_TYPES_ENUMS.ECOMMERCE,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  userType: string;
}
