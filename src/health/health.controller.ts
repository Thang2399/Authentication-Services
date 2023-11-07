import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  @ApiOperation({
    description: 'Check health of sever',
  })
  @Get()
  async getHealthCheck() {
    return 'Hello world! Service is still alive!';
  }
}
