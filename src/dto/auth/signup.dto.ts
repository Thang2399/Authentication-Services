import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { Gender_Enum } from '../../enum/user.enum';
import dayjs from 'dayjs';

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
}
