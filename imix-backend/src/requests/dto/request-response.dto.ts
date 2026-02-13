import { ApiProperty } from '@nestjs/swagger';

export class RequestRecordDto {
  @ApiProperty({ example: '67ad43c3d6c5d9f3ec4a3b31' })
  id!: string;

  @ApiProperty({ example: 'David Mirada' })
  fullName!: string;

  @ApiProperty({ example: 'david@correo.com' })
  email!: string;

  @ApiProperty({ example: '+57 3001234567' })
  phone!: string;

  @ApiProperty({ example: 'Integracion API y soporte' })
  service!: string;

  @ApiProperty({ example: 'Necesito integrar mi formulario web con su API.' })
  message!: string;

  @ApiProperty({ example: 'in_progress', enum: ['pending', 'in_progress', 'completed'] })
  status!: 'pending' | 'in_progress' | 'completed';

  @ApiProperty({ example: '2026-02-13T05:10:12.240Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-02-13T05:10:12.240Z' })
  updatedAt!: string;
}

export class MockAiResultDto {
  @ApiProperty({
    example: 'technical',
    enum: ['sales', 'support', 'billing', 'technical', 'general'],
  })
  category!: 'sales' | 'support' | 'billing' | 'technical' | 'general';

  @ApiProperty({ example: 'high', enum: ['low', 'medium', 'high'] })
  priority!: 'low' | 'medium' | 'high';

  @ApiProperty({ example: 0.92 })
  confidence!: number;

  @ApiProperty({ example: 'in_progress', enum: ['pending', 'in_progress'] })
  suggestedStatus!: 'pending' | 'in_progress';

  @ApiProperty({ example: 'Clasificacion mock IA: technical con prioridad high.' })
  summary!: string;
}

export class CreateRequestResponseDto {
  @ApiProperty({ type: RequestRecordDto })
  request!: RequestRecordDto;

  @ApiProperty({ type: MockAiResultDto })
  ai!: MockAiResultDto;
}

export class RequestsPageMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 125 })
  totalItems!: number;

  @ApiProperty({ example: 7 })
  totalPages!: number;
}

export class PaginatedRequestsResponseDto {
  @ApiProperty({ type: RequestRecordDto, isArray: true })
  items!: RequestRecordDto[];

  @ApiProperty({ type: RequestsPageMetaDto })
  meta!: RequestsPageMetaDto;
}
