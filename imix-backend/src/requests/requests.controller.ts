import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRequestDto } from './dto/create-request.dto';
import { ListRequestsQueryDto } from './dto/list-requests-query.dto';
import {
  CreateRequestResponseDto,
  PaginatedRequestsResponseDto,
} from './dto/request-response.dto';
import type { CreateRequestInput } from './contracts/create-request.input';
import { RequestsService } from './requests.service';

@ApiTags('requests')
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Receive and process a request with mock IA enrichment' })
  @ApiBody({
    type: CreateRequestDto,
    examples: {
      default: {
        summary: 'Base request payload',
        value: {
          fullName: 'David Mirada',
          email: 'david@correo.com',
          phone: '+57 3001234567',
          service: 'Integracion API y soporte',
          message: 'Necesito integrar mi formulario web con su API.',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Request stored and processed with mock IA response',
    type: CreateRequestResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error in request body',
  })
  handleRequest(@Body() body: CreateRequestDto): Promise<CreateRequestResponseDto> {
    return this.requestsService.create(this.toCreateRequestInput(body));
  }

  @Get()
  @ApiOperation({ summary: 'List saved requests ordered by most recent' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiOkResponse({
    description: 'Paginated list of requests',
    type: PaginatedRequestsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid pagination query params',
  })
  getStatus(@Query() query: ListRequestsQueryDto): Promise<PaginatedRequestsResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    return this.requestsService.findAll({ page, limit });
  }

  private toCreateRequestInput(dto: CreateRequestDto): CreateRequestInput {
    return {
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      service: dto.service,
      message: dto.message,
    };
  }
}
