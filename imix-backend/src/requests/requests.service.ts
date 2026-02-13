import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { CreateRequestInput } from './contracts/create-request.input';
import { Request, RequestDocument } from './schemas/request.schema';

export type RequestStatus = 'pending' | 'in_progress' | 'completed';

export interface RequestRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MockAiResult {
  category: 'sales' | 'support' | 'billing' | 'technical' | 'general';
  priority: 'low' | 'medium' | 'high';
  confidence: number;
  suggestedStatus: 'pending' | 'in_progress';
  summary: string;
}

export interface CreateRequestResult {
  request: RequestRecord;
  ai: MockAiResult;
}

export interface FindAllRequestsInput {
  page: number;
  limit: number;
}

export interface PaginatedRequestsResult {
  items: RequestRecord[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name)
    private readonly requestModel: Model<RequestDocument>,
  ) {}

  async create(payload: CreateRequestInput): Promise<CreateRequestResult> {
    const ai = this.runAiMock(payload);

    const created = new this.requestModel({
      ...payload,
      status: ai.suggestedStatus,
    });

    const request = await created.save();
    return { request: this.toRequestRecord(request), ai };
  }

  async findAll(input: FindAllRequestsInput): Promise<PaginatedRequestsResult> {
    const { page, limit } = input;
    const skip = (page - 1) * limit;

    const [docs, totalItems] = await Promise.all([
      this.requestModel
        .find()
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.requestModel.countDocuments().exec(),
    ]);

    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

    return {
      items: docs.map((doc) => this.toRequestRecord(doc)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  private runAiMock(input: Pick<CreateRequestInput, 'service' | 'message'>): MockAiResult {
    const text = `${input.service} ${input.message}`.toLowerCase();

    const hasAny = (keywords: string[]) =>
      keywords.some((keyword) => text.includes(keyword));

    const urgentKeywords = [
      'urgente',
      'caido',
      'caida',
      'error',
      'falla',
      'no funciona',
      'critical',
      'urgent',
    ];
    const billingKeywords = ['factura', 'pago', 'cobro', 'invoice', 'billing'];
    const technicalKeywords = ['api', 'bug', 'backend', 'frontend', 'integracion'];
    const salesKeywords = ['precio', 'cotizacion', 'demo', 'plan', 'compra'];

    let category: MockAiResult['category'] = 'general';
    if (hasAny(billingKeywords)) {
      category = 'billing';
    } else if (hasAny(technicalKeywords)) {
      category = 'technical';
    } else if (hasAny(salesKeywords)) {
      category = 'sales';
    } else if (text.length > 0) {
      category = 'support';
    }

    const isUrgent = hasAny(urgentKeywords);
    const priority: MockAiResult['priority'] = isUrgent
      ? 'high'
      : category === 'technical' || category === 'billing'
        ? 'medium'
        : 'low';

    const confidence = isUrgent ? 0.92 : category === 'general' ? 0.64 : 0.81;
    const suggestedStatus: MockAiResult['suggestedStatus'] = isUrgent
      ? 'in_progress'
      : 'pending';

    return {
      category,
      priority,
      confidence,
      suggestedStatus,
      summary: `Clasificacion mock IA: ${category} con prioridad ${priority}.`,
    };
  }

  private toRequestRecord(doc: RequestDocument): RequestRecord {
    const createdAtValue = doc.get('createdAt');
    const updatedAtValue = doc.get('updatedAt');

    const createdAt =
      createdAtValue instanceof Date
        ? createdAtValue
        : new Date(createdAtValue ?? Date.now());

    const updatedAt =
      updatedAtValue instanceof Date
        ? updatedAtValue
        : new Date(updatedAtValue ?? Date.now());

    return {
      id: String(doc._id),
      fullName: doc.fullName,
      email: doc.email,
      phone: doc.phone,
      service: doc.service,
      message: doc.message,
      status: doc.status as RequestStatus,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }
}

