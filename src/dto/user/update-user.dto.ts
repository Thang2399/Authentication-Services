import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Gender_Enum } from '@/src/shared/enum/user.enum';
import dayjs from 'dayjs';

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
}
