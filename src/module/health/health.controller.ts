import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health check')
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
