import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ORDER_STATUS } from '@core/const/order-status.const';
import { ROUTES } from '@core/const/routes';
import { ShippingAddress } from '@core/interfaces/order.interface';
import { OrderService } from '@core/services/order.service';
import { PaymentService } from '@core/services/payment.service';
import { AuthStore } from '@core/store/auth.store';
import { CartStore } from '@core/store/cart.store';

const PAYMENT_METHOD = {
  Card: 'card',
  Bizum: 'bizum',
  Paypal: 'paypal',
} as const;
type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

const FREE_SHIPPING_THRESHOLD = 40;
const SHIPPING_COST = 4.95;

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, FormsModule, RouterLink],
  selector: 'app-checkout',
  styleUrl: './checkout.component.scss',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  private readonly router = inject(Router);
  protected readonly cartStore = inject(CartStore);
  private readonly orderService = inject(OrderService);
  private readonly paymentService = inject(PaymentService);
  private readonly authStore = inject(AuthStore);

  protected readonly address = signal<ShippingAddress>({
    city: '',
    country: 'España',
    fullName: '',
    phone: '',
    postalCode: '',
    province: '',
    street: '',
  });
  protected readonly email = signal('');
  protected readonly error = signal<string | null>(null);
  protected readonly isProcessing = signal(false);
  protected readonly selectedPayment = signal<PaymentMethod>(PAYMENT_METHOD.Card);

  protected readonly PAYMENT_METHOD = PAYMENT_METHOD;
  protected readonly routes = ROUTES;

  protected get shippingCost(): number {
    return this.cartStore.total() >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  }

  protected get orderTotal(): number {
    return this.cartStore.total() + this.shippingCost;
  }

  protected get orderTotalInCents(): number {
    return Math.round(this.orderTotal * 100);
  }

  protected selectPayment(method: PaymentMethod): void {
    this.selectedPayment.set(method);
  }

  protected updateAddress(field: keyof ShippingAddress, value: string): void {
    this.address.update((addr) => ({ ...addr, [field]: value }));
  }

  protected submit(): void {
    this.isProcessing.set(true);
    this.error.set(null);

    this.paymentService.createPaymentIntent(this.orderTotalInCents).subscribe({
      next: (clientSecret) => this.confirmOrder(clientSecret),
      error: () => {
        this.isProcessing.set(false);
        this.error.set('payment.error.generic');
      },
    });
  }

  private confirmOrder(clientSecret: string): void {
    this.orderService
      .create({
        userId: this.authStore.user()?.uid ?? null,
        items: this.cartStore.items(),
        total: this.orderTotal,
        shippingAddress: this.address(),
        status: ORDER_STATUS.Pending,
        stripePaymentIntentId: clientSecret.split('_secret_')[0],
      })
      .subscribe({
        next: (orderId) => {
          this.cartStore.clear();
          this.router.navigate(['/' + ROUTES.ORDER_CONFIRMED], {
            queryParams: { orderId, success: true },
          });
        },
        error: () => {
          this.isProcessing.set(false);
          this.error.set('payment.error.order_creation');
        },
      });
  }
}
