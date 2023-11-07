import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LoginWithEmailPasswordDto {
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
}
