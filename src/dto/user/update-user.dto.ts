import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender_Enum } from '@/src/shared/enum/user.enum';
import dayjs from 'dayjs';
import { USER_TYPES_ENUMS } from '@/src/enum';

export class UpdateUserDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @Expose()
  gender: string = Gender_Enum.MALE;

  @ApiProperty()
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
