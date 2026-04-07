import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  receiptEmail?: string;
  userId?: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

const API_BASE = '/api';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);

  createPaymentIntent(
    amountInCents: number,
    options?: { receiptEmail?: string; userId?: string }
  ): Observable<CreatePaymentIntentResponse> {
    const body: CreatePaymentIntentRequest = {
      amount: amountInCents,
      currency: 'eur',
      ...(options?.receiptEmail && { receiptEmail: options.receiptEmail }),
      ...(options?.userId && { userId: options.userId }),
    };

    return this.http.post<CreatePaymentIntentResponse>(`${API_BASE}/create-payment-intent`, body);
  }
}
