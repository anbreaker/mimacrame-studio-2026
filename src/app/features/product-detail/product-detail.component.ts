import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { ProductService } from '@core/services/product.service';
import { SeoService } from '@core/services/seo.service';
import { CartStore } from '@core/store/cart.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink, TranslocoDirective],
  selector: 'app-product-detail',
  standalone: true,
  styleUrl: './product-detail.component.scss',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {
  private readonly cartStore = inject(CartStore);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  protected readonly quantity = signal(1);

  protected readonly selectedImageIndex = signal(0);

  private readonly _productState = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((id) =>
        id
          ? this.productService
              .getActive()
              .pipe(map((products) => products.find((product) => product.id === id) ?? null))
          : [null]
      )
    )
  );

  protected readonly isLoading = computed(() => this._productState() === undefined);
  protected readonly product = computed(() => this._productState() ?? null);

  protected readonly selectedImage = computed(
    () =>
      this.product()?.images[this.selectedImageIndex()] ?? 'assets/images/placeholder-product.jpg'
  );

  protected readonly routes = ROUTES;

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) {
        this.seoService.update({
          description: p.description,
          image: p.images[0],
          title: p.name,
        });
      } else if (!this.isLoading()) {
        this.seoService.resetToDefaults();
      }
    });
  }

  protected addToCart(): void {
    const product = this.product();
    product && this.cartStore.addItem(product, this.quantity());
  }

  protected buyNow(): void {
    this.addToCart();
    this.router.navigate(['/' + ROUTES.CHECKOUT]);
  }

  protected decreaseQuantity(): void {
    this.quantity.update((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  protected increaseQuantity(): void {
    this.quantity.update((currentQuantity) => Math.min(10, currentQuantity + 1));
  }

  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }
}
