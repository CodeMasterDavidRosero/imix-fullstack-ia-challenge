import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService, type HealthCheckResponse } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Basic hello endpoint' })
  @ApiOkResponse({ description: 'Service basic response' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check and MongoDB readiness' })
  @ApiOkResponse({ description: 'Service health snapshot' })
  getHealth(): HealthCheckResponse {
    return this.appService.getHealth();
  }
}
