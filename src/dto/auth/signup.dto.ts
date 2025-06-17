import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { Gender_Enum } from '@/src/shared/enum/user.enum';
import dayjs from 'dayjs';
import { USER_TYPES_ENUMS } from '@/src/enum';

export class SignupWithEmailDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  userName: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  phoneNumber: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  password: string;

  @ApiProperty()
  @IsString()
  @Expose()
  gender: string = Gender_Enum.MALE;

  @ApiProperty()
  @IsString()
  @Expose()
  dateOfBirth: string = dayjs().format('MM-DD-YYYY');

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
