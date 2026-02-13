import { TestingModule, Test } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import type { CreateRequestInput } from './contracts/create-request.input';
import { Request, RequestSchema } from './schemas/request.schema';
import { RequestsService } from './requests.service';

describe('RequestsService (integration)', () => {
  let mongod: MongoMemoryServer;
  let moduleRef: TestingModule;
  let service: RequestsService;
  let connection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
      ],
      providers: [RequestsService],
    }).compile();

    service = moduleRef.get(RequestsService);
    connection = moduleRef.get<Connection>(getConnectionToken());
  });

  afterEach(async () => {
    if (connection?.db) {
      await connection.db.dropDatabase();
    }
  });

  afterAll(async () => {
    await moduleRef.close();
    await mongod.stop();
  });

  function buildPayload(overrides: Partial<CreateRequestInput> = {}): CreateRequestInput {
    return {
      fullName: 'John Doe',
      email: 'John@Example.com',
      phone: '+57 3001234567',
      service: 'Integracion API y soporte',
      message: 'Necesito soporte tecnico urgente, no funciona.',
      ...overrides,
    };
  }

  it('creates a request in Mongo and returns normalized record with mock IA data', async () => {
    const result = await service.create(buildPayload());

    expect(result.request.id).toBeDefined();
    expect(result.request.email).toBe('john@example.com');
    expect(result.request.status).toBe(result.ai.suggestedStatus);
    expect(result.ai.summary).toContain('Clasificacion mock IA');
    expect(Number.isNaN(Date.parse(result.request.createdAt))).toBe(false);
    expect(Number.isNaN(Date.parse(result.request.updatedAt))).toBe(false);
  });

  it('returns paginated requests with metadata', async () => {
    await service.create(buildPayload({ service: 'Servicio A', message: 'Mensaje A' }));
    await service.create(buildPayload({ service: 'Servicio B', message: 'Mensaje B' }));
    await service.create(buildPayload({ service: 'Servicio C', message: 'Mensaje C' }));

    const firstPage = await service.findAll({ page: 1, limit: 2 });
    const secondPage = await service.findAll({ page: 2, limit: 2 });

    expect(firstPage.items).toHaveLength(2);
    expect(firstPage.meta).toEqual({
      page: 1,
      limit: 2,
      totalItems: 3,
      totalPages: 2,
    });

    expect(secondPage.items).toHaveLength(1);
    expect(secondPage.meta).toEqual({
      page: 2,
      limit: 2,
      totalItems: 3,
      totalPages: 2,
    });
  });
});
