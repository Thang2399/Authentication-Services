import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateUserPasswordDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  userId: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  currentPassword: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  newPassword: string;
}
