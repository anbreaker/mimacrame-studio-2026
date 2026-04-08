import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { LANG } from '@core/const/lang.const';
import { ROUTES } from '@core/const/routes';
import { Product } from '@core/interfaces/product.interface';
import { AuthStore } from '@core/store/auth.store';
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
  private readonly transloco = inject(TranslocoService);

  protected readonly authStore = inject(AuthStore);
  protected readonly cartStore = inject(CartStore);

  readonly product = input.required<Product>();

  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected readonly localizedName = computed(() => {
    const lang = this.activeLang();
    const name = this.product().name;
    if (typeof name === 'string') return name;
    return name[lang as keyof typeof name] || name[LANG.Es] || '';
  });

  protected readonly routes = ROUTES;

  protected addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartStore.addItem(this.product());
  }
}
