import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

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
}
