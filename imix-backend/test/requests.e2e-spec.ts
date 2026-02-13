import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { RequestsController } from '../src/requests/requests.controller';
import { RequestsService } from '../src/requests/requests.service';

describe('RequestsController (e2e)', () => {
  let app: INestApplication<App>;

  const requestsServiceMock: {
    create: jest.Mock;
    findAll: jest.Mock;
  } = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [
        {
          provide: RequestsService,
          useValue: requestsServiceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  beforeEach(() => {
    requestsServiceMock.create.mockReset();
    requestsServiceMock.findAll.mockReset();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /requests should create and return processed request', async () => {
    const payload = {
      fullName: 'David Mirada',
      email: 'david@correo.com',
      phone: '+57 3001234567',
      service: 'Integracion API y soporte',
      message: 'Necesito integrar mi formulario web con su API.',
    };

    const mockedResponse = {
      request: {
        id: '67ad43c3d6c5d9f3ec4a3b31',
        ...payload,
        status: 'in_progress',
        createdAt: '2026-02-13T05:10:12.240Z',
        updatedAt: '2026-02-13T05:10:12.240Z',
      },
      ai: {
        category: 'technical',
        priority: 'high',
        confidence: 0.92,
        suggestedStatus: 'in_progress',
        summary: 'Clasificacion mock IA: technical con prioridad high.',
      },
    };

    requestsServiceMock.create.mockResolvedValue(mockedResponse);

    const response = await request(app.getHttpServer())
      .post('/requests')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual(mockedResponse);
    expect(requestsServiceMock.create).toHaveBeenCalledWith(payload);
  });

  it('POST /requests should return 400 when payload is invalid', async () => {
    const invalidPayload = {
      fullName: 'David Mirada',
      phone: '+57 3001234567',
      service: 'Integracion API y soporte',
      message: 'Necesito integrar mi formulario web con su API.',
      extraField: 'not-allowed',
    };

    const response = await request(app.getHttpServer())
      .post('/requests')
      .send(invalidPayload)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.stringContaining('email should not be empty'),
        expect.stringContaining('email must be an email'),
        expect.stringContaining('property extraField should not exist'),
      ]),
    );
    expect(requestsServiceMock.create).not.toHaveBeenCalled();
  });

  it('GET /requests should return paginated request list with defaults', async () => {
    const mockedResult = {
      items: [
        {
          id: '67ad43c3d6c5d9f3ec4a3b31',
          fullName: 'David Mirada',
          email: 'david@correo.com',
          phone: '+57 3001234567',
          service: 'Integracion API y soporte',
          message: 'Necesito integrar mi formulario web con su API.',
          status: 'in_progress',
          createdAt: '2026-02-13T05:10:12.240Z',
          updatedAt: '2026-02-13T05:10:12.240Z',
        },
      ],
      meta: {
        page: 1,
        limit: 20,
        totalItems: 1,
        totalPages: 1,
      },
    };

    requestsServiceMock.findAll.mockResolvedValue(mockedResult);

    const response = await request(app.getHttpServer())
      .get('/requests')
      .expect(200);

    expect(response.body).toEqual(mockedResult);
    expect(requestsServiceMock.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
    });
  });

  it('GET /requests should return 400 for invalid limit', async () => {
    await request(app.getHttpServer())
      .get('/requests?limit=200')
      .expect(400);

    expect(requestsServiceMock.findAll).not.toHaveBeenCalled();
  });
});
