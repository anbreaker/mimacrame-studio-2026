import { inject, Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { from, map, Observable } from 'rxjs';

interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly functions = inject(Functions);

  createPaymentIntent(amountInCents: number): Observable<string> {
    const fn = httpsCallable<CreatePaymentIntentRequest, CreatePaymentIntentResponse>(
      this.functions,
      'createPaymentIntent'
    );
    return from(fn({ amount: amountInCents, currency: 'eur' })).pipe(
      map((result) => result.data.clientSecret)
    );
  }
}
