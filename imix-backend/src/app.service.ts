import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export type HealthStatus = 'ok' | 'degraded';
export type MongoStatus = 'up' | 'starting' | 'down';

export interface HealthCheckResponse {
  status: HealthStatus;
  service: string;
  mongo: MongoStatus;
  timestamp: string;
  uptimeSeconds: number;
}

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): HealthCheckResponse {
    const mongo = this.mapMongoStatus(this.connection.readyState);
    const status: HealthStatus = mongo === 'up' ? 'ok' : 'degraded';

    return {
      status,
      service: 'imix-backend',
      mongo,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }

  private mapMongoStatus(readyState: number): MongoStatus {
    if (readyState === 1) {
      return 'up';
    }

    if (readyState === 2) {
      return 'starting';
    }

    return 'down';
  }
}
