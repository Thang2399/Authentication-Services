import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Health check')
@Controller('health')
export class HealthController {
  @ApiOperation({
    description: 'Check health of sever',
  })
  @Get()
  async getHealthCheck(@Res() res: Response) {
    return res
      .status(200)
      .json({ message: 'Hello world! Service is still alive!' });
  }
}
