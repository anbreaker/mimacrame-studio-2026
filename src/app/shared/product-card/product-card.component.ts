import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { Product } from '@core/interfaces/product.interface';
import { CartStore } from '@core/store/cart.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink, TranslocoDirective],
  selector: 'app-product-card',
  standalone: true,
  styleUrl: './product-card.component.scss',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  protected readonly cartStore = inject(CartStore);

  readonly product = input.required<Product>();

  protected readonly routes = ROUTES;

  protected addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    !this.isOutOfStock && this.cartStore.addItem(this.product());
  }

  protected get isLowStock(): boolean {
    return this.product().stock > 0 && this.product().stock <= 2;
  }

  protected get isOutOfStock(): boolean {
    return this.product().stock === 0;
  }
}
