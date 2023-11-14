import { ApiProperty } from '@nestjs/swagger';

export class AbstractDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  createdAt?: string = new Date().toISOString();

  @ApiProperty()
  updatedAt?: string = new Date().toISOString();
}

export class AbstractSoftDeleteDto {
  @ApiProperty()
  deletedAt?: string;
}
