import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, timeout } from 'rxjs';
import { environment } from '../environments/environment';

export interface RequestPayload {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface BackendResponse {
  request?: {
    status?: string;
  };
  ai?: {
    summary?: string;
  };
}

export interface RequestUiResponse {
  aiEnrichment: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class RequestService {
  private readonly apiUrl = `${environment.apiBaseUrl}/requests`;

  constructor(private readonly http: HttpClient) {}

  sendRequest(payload: RequestPayload): Observable<RequestUiResponse> {
    const cleanPayload: RequestPayload = {
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      service: payload.service.trim(),
      message: payload.message.trim(),
    };

    return this.http.post<BackendResponse>(this.apiUrl, cleanPayload).pipe(
      timeout(15000),
      map((res) => ({
        aiEnrichment:
          res.ai?.summary ??
          'Solicitud recibida y enviada al procesador IA.',
        status: res.request?.status ?? 'pending',
      })),
    );
  }
}
