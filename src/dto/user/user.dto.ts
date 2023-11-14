import { AbstractSoftDeleteDto } from '@/src/dto/abstract/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Gender_Enum, User_Role_Enum } from '@/src/shared/enum/user.enum';
import dayjs from 'dayjs';

export class UserDto extends AbstractSoftDeleteDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Expose()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @Expose()
  gender: string = Gender_Enum.MALE;

  @ApiProperty()
  @Expose()
  role: string = User_Role_Enum.USER;

  @ApiProperty()
  @Expose()
  dateOfBirth: string = dayjs().format('MM-DD-YYYY');
}
