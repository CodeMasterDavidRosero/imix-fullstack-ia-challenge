import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, TimeoutError } from 'rxjs';
import { RequestService, type RequestPayload, type RequestUiResponse } from '../../services/request.service';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './request-form.html',
  styleUrl: './request-form.scss',
})
export class RequestForm {
  private readonly requestService = inject(RequestService);

  request: RequestPayload = {
    fullName: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  };
  response = signal<RequestUiResponse | null>(null);
  loading = signal(false);
  error = signal('');

  enviar() {
    const hasEmptyRequiredField =
      !this.request.fullName.trim() ||
      !this.request.email.trim() ||
      !this.request.phone.trim() ||
      !this.request.service.trim() ||
      !this.request.message.trim();

    if (hasEmptyRequiredField) {
      this.error.set('Completa todos los campos obligatorios.');
      return;
    }

    this.loading.set(true);
    this.response.set(null);
    this.error.set('');

    this.requestService
      .sendRequest(this.request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.response.set(res);
        },
        error: (err) => {
          console.error(err);
          this.error.set(this.getErrorMessage(err));
        },
      });
  }

  private getErrorMessage(err: unknown): string {
    if (err instanceof TimeoutError) {
      return 'La API tardo demasiado en responder. Verifica que el backend este arriba en http://localhost:3001.';
    }

    if (err instanceof HttpErrorResponse) {
      const apiMessage = err.error?.message;

      if (Array.isArray(apiMessage) && apiMessage.length > 0) {
        return apiMessage.join(' | ');
      }

      if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
        return apiMessage;
      }
    }

    return 'Hubo un error al procesar la solicitud.';
  }
}

