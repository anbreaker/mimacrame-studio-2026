import { CurrencyPipe } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { email as emailValidator, form, FormField, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ORDER_STATUS } from '@core/const/order-status.const';
import { ROUTES } from '@core/const/routes';
import { OrderService } from '@core/services/order.service';
import { PaymentService } from '@core/services/payment.service';
import { SeoService } from '@core/services/seo.service';
import { StripeService } from '@core/services/stripe.service';
import { AuthStore } from '@core/store/auth.store';
import { CartStore } from '@core/store/cart.store';

import { CHECKOUT_ERROR, CheckoutError } from './checkout-error.const';

interface CheckoutFormData {
  city: string;
  country: string;
  email: string;
  fullName: string;
  phone: string;
  postalCode: string;
  province: string;
  street: string;
}

const FREE_SHIPPING_THRESHOLD = 40;
const SHIPPING_COST = 4.95;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, FormField, RouterLink, TranslocoDirective],
  selector: 'app-checkout',
  standalone: true,
  styleUrl: './checkout.component.scss',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnDestroy {
  private readonly authStore = inject(AuthStore);
  private readonly orderService = inject(OrderService);
  private readonly paymentService = inject(PaymentService);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  protected readonly cartStore = inject(CartStore);
  protected readonly stripeService = inject(StripeService);

  private readonly checkoutModel = signal<CheckoutFormData>({
    city: '',
    country: '',
    email: '',
    fullName: '',
    phone: '',
    postalCode: '',
    province: '',
    street: '',
  });

  protected readonly clientSecret = signal<string | null>(null);

  protected readonly errorKey = signal<CheckoutError | null>(null);
  protected readonly isPaymentReady = signal(false);
  protected readonly isProcessing = signal(false);
  protected readonly checkoutForm = form(this.checkoutModel, (schemaPath) => {
    required(schemaPath.email);
    emailValidator(schemaPath.email);
    required(schemaPath.fullName);
    required(schemaPath.street);
    required(schemaPath.postalCode);
    required(schemaPath.city);
    required(schemaPath.country);
    required(schemaPath.phone);
  });

  protected readonly isFormValid = computed(
    () =>
      this.checkoutForm.email().valid() &&
      this.checkoutForm.fullName().valid() &&
      this.checkoutForm.street().valid() &&
      this.checkoutForm.postalCode().valid() &&
      this.checkoutForm.city().valid() &&
      this.checkoutForm.country().valid() &&
      this.checkoutForm.phone().valid()
  );

  protected readonly canSubmit = computed(
    () => this.isFormValid() && this.isPaymentReady() && !this.isProcessing()
  );

  protected readonly shippingCost = computed(() =>
    this.cartStore.total() >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  );

  protected readonly orderTotal = computed(() => this.cartStore.total() + this.shippingCost());

  protected readonly orderTotalInCents = computed(() => Math.round(this.orderTotal() * 100));

  private readonly paymentElementRef = viewChild<ElementRef<HTMLDivElement>>('paymentElement');

  protected readonly routes = ROUTES;

  constructor() {
    this.seoService.update({ titleKey: 'checkout.title' });

    const user = this.authStore.user();
    if (user) {
      this.checkoutModel.set({
        city: user.address?.city ?? '',
        country: user.address?.country ?? '',
        email: user.email ?? '',
        fullName: user.address?.fullName ?? user.displayName ?? '',
        phone: user.address?.phone ?? '',
        postalCode: user.address?.postalCode ?? '',
        province: user.address?.province ?? '',
        street: user.address?.street ?? '',
      });
    }

    afterNextRender(() => {
      this.initializeStripePayment();
    });
  }

  ngOnDestroy(): void {
    this.stripeService.destroy();
  }

  private createOrder(paymentIntentId: string): void {
    const data = this.checkoutModel();

    this.orderService
      .create({
        customerEmail: data.email,
        items: this.cartStore.items(),
        shippingAddress: {
          city: data.city,
          country: data.country,
          fullName: data.fullName,
          phone: data.phone,
          postalCode: data.postalCode,
          province: data.province,
          street: data.street,
        },
        status: ORDER_STATUS.Pending,
        stripePaymentIntentId: paymentIntentId,
        total: this.orderTotal(),
        userId: this.authStore.user()?.uid ?? null,
      })
      .subscribe({
        error: () => {
          this.isProcessing.set(false);
          this.errorKey.set(CHECKOUT_ERROR.OrderCreation);
        },
        next: (orderId) => {
          this.cartStore.clear();
          this.router.navigate(['/' + ROUTES.ORDER_CONFIRMED], {
            queryParams: { orderId, success: true },
          });
        },
      });
  }

  private async initializeStripePayment(): Promise<void> {
    if (this.cartStore.isEmpty()) return;

    this.errorKey.set(null);

    try {
      await this.stripeService.initialize();

      const email = this.checkoutModel().email || undefined;
      const userId = this.authStore.user()?.uid || undefined;

      this.paymentService
        .createPaymentIntent(this.orderTotalInCents(), {
          receiptEmail: email,
          userId,
        })
        .subscribe({
          error: () => {
            this.errorKey.set(CHECKOUT_ERROR.Generic);
          },
          next: async (secret) => {
            this.clientSecret.set(secret);

            const container = this.paymentElementRef()?.nativeElement;
            if (container) {
              await this.stripeService.mountPaymentElement(secret, container);

              if (!this.stripeService.error()) {
                this.isPaymentReady.set(true);
              } else {
                this.errorKey.set(CHECKOUT_ERROR.Generic);
              }
            }
          },
        });
    } catch {
      this.errorKey.set(CHECKOUT_ERROR.Generic);
    }
  }

  protected async submit(): Promise<void> {
    if (!this.canSubmit()) return;

    this.isProcessing.set(true);
    this.errorKey.set(null);

    const returnUrl = `${window.location.origin}/${ROUTES.ORDER_CONFIRMED}`;
    const result = await this.stripeService.confirmPayment(returnUrl);

    if (result.error) {
      this.isProcessing.set(false);
      this.errorKey.set(CHECKOUT_ERROR.CardDeclined);
      return;
    }

    if (!result.paymentIntentId) {
      this.isProcessing.set(false);
      this.errorKey.set(CHECKOUT_ERROR.CardDeclined);
      return;
    }

    this.createOrder(result.paymentIntentId);
  }
}
