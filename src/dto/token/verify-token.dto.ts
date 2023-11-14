import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class VerifyTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  token: string;
}
