import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class ForgotPasswordDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;
}
