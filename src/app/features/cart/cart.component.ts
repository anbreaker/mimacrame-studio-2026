import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { CartStore } from '@core/store/cart.store';
import { ROUTES } from '@core/const/routes';

const FREE_SHIPPING_THRESHOLD = 40;

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  protected readonly cartStore = inject(CartStore);
  protected readonly routes = ROUTES;
  protected readonly freeShippingThreshold = FREE_SHIPPING_THRESHOLD;

  protected get shippingCost(): number {
    return this.cartStore.total() >= FREE_SHIPPING_THRESHOLD ? 0 : 4.95;
  }

  protected get orderTotal(): number {
    return this.cartStore.total() + this.shippingCost;
  }

  protected get remainingForFreeShipping(): number {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - this.cartStore.total());
  }
}
