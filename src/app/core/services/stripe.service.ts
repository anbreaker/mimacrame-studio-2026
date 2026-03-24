import { Injectable, signal } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StripeService {
  readonly error = signal<string | null>(null);
  readonly isLoading = signal(false);
  private elements: StripeElements | null = null;

  private paymentElement: StripePaymentElement | null = null;
  private stripe: Stripe | null = null;

  async confirmPayment(returnUrl: string): Promise<{ error?: string; paymentIntentId?: string }> {
    if (!this.stripe || !this.elements) {
      return { error: 'Stripe not initialized' };
    }

    const { error, paymentIntent } = await this.stripe.confirmPayment({
      confirmParams: { return_url: returnUrl },
      elements: this.elements,
      redirect: 'if_required',
    });

    if (error) {
      return { error: error.message ?? 'Payment failed' };
    }

    return { paymentIntentId: paymentIntent?.id };
  }

  destroy(): void {
    this.paymentElement?.destroy();
    this.paymentElement = null;
    this.elements = null;
    this.error.set(null);
    this.isLoading.set(false);
  }

  async initialize(): Promise<void> {
    if (this.stripe) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      this.stripe = await loadStripe(environment.stripePublicKey);

      if (!this.stripe) {
        throw new Error('Failed to load Stripe');
      }
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Failed to initialize Stripe');
    } finally {
      this.isLoading.set(false);
    }
  }

  async mountPaymentElement(clientSecret: string, container: HTMLElement): Promise<void> {
    if (!this.stripe) {
      this.error.set('Stripe not initialized');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      this.elements = this.stripe.elements({
        appearance: {
          theme: 'stripe',
          variables: {
            borderRadius: '6px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          },
        },
        clientSecret,
      });

      this.paymentElement = this.elements.create('payment');
      this.paymentElement.mount(container);

      await new Promise<void>((resolve, reject) => {
        this.paymentElement!.on('ready', () => resolve());
        this.paymentElement!.on('loaderror', (event) =>
          reject(new Error(event.error?.message ?? 'Payment Element failed to load'))
        );
      });
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to mount payment element');
    } finally {
      this.isLoading.set(false);
    }
  }
}
