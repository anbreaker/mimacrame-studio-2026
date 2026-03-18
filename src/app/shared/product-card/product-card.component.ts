import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ROUTES } from '../../core/const/routes';
import { Product } from '../../core/interfaces/product.interface';
import { CartStore } from '../../core/store/cart.store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-product-card',
  styleUrl: './product-card.component.scss',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  protected readonly cartStore = inject(CartStore);
  protected readonly routes = ROUTES;

  protected get isOutOfStock(): boolean {
    return this.product().stock === 0;
  }

  protected get isLowStock(): boolean {
    return this.product().stock > 0 && this.product().stock <= 2;
  }

  protected addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    !this.isOutOfStock && this.cartStore.addItem(this.product());
  }
}
