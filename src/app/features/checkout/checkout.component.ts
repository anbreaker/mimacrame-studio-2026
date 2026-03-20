import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { email as emailValidator, form, FormField, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ORDER_STATUS } from '@core/const/order-status.const';
import { ROUTES } from '@core/const/routes';
import { OrderService } from '@core/services/order.service';
import { PaymentService } from '@core/services/payment.service';
import { AuthStore } from '@core/store/auth.store';
import { CartStore } from '@core/store/cart.store';

const PAYMENT_METHOD = {
  Bizum: 'bizum',
  Card: 'card',
  Paypal: 'paypal',
} as const;
type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

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
export class CheckoutComponent {
  private readonly authStore = inject(AuthStore);
  private readonly orderService = inject(OrderService);
  private readonly paymentService = inject(PaymentService);
  private readonly router = inject(Router);

  protected readonly cartStore = inject(CartStore);

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

  protected readonly errorKey = signal<string | null>(null);

  protected readonly isProcessing = signal(false);
  protected readonly selectedPayment = signal<PaymentMethod>(PAYMENT_METHOD.Card);
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

  protected readonly shippingCost = computed(() =>
    this.cartStore.total() >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  );

  protected readonly orderTotal = computed(() => this.cartStore.total() + this.shippingCost());

  protected readonly orderTotalInCents = computed(() => Math.round(this.orderTotal() * 100));

  protected readonly PAYMENT_METHOD = PAYMENT_METHOD;
  protected readonly routes = ROUTES;

  constructor() {
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
  }

  private confirmOrder(clientSecret: string): void {
    const data = this.checkoutModel();

    this.orderService
      .create({
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
        stripePaymentIntentId: clientSecret.split('_secret_')[0],
        total: this.orderTotal(),
        userId: this.authStore.user()?.uid ?? null,
      })
      .subscribe({
        error: () => {
          this.isProcessing.set(false);
          this.errorKey.set('errors.order_creation');
        },
        next: (orderId) => {
          this.cartStore.clear();
          this.router.navigate(['/' + ROUTES.ORDER_CONFIRMED], {
            queryParams: { orderId, success: true },
          });
        },
      });
  }

  protected selectPayment(method: PaymentMethod): void {
    this.selectedPayment.set(method);
  }

  protected submit(): void {
    if (!this.isFormValid()) return;

    this.isProcessing.set(true);
    this.errorKey.set(null);

    this.paymentService.createPaymentIntent(this.orderTotalInCents()).subscribe({
      error: () => {
        this.isProcessing.set(false);
        this.errorKey.set('errors.generic');
      },
      next: (clientSecret) => this.confirmOrder(clientSecret),
    });
  }
}
