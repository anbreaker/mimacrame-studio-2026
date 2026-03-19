import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { CartStore } from '@core/store/cart.store';

const FREE_SHIPPING_THRESHOLD = 40;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink, TranslocoDirective],
  selector: 'app-cart',
  standalone: true,
  styleUrl: './cart.component.scss',
  templateUrl: './cart.component.html',
})
export class CartComponent {
  protected readonly cartStore = inject(CartStore);

  protected readonly freeShippingThreshold = FREE_SHIPPING_THRESHOLD;
  protected readonly routes = ROUTES;

  protected get orderTotal(): number {
    return this.cartStore.total() + this.shippingCost;
  }

  protected get remainingForFreeShipping(): number {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - this.cartStore.total());
  }

  protected get shippingCost(): number {
    return this.cartStore.total() >= FREE_SHIPPING_THRESHOLD ? 0 : 4.95;
  }
}
