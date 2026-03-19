import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { map } from 'rxjs';

import { ROUTES } from '@core/const/routes';
import { Product } from '@core/interfaces/product.interface';
import { ProductService } from '@core/services/product.service';
import { CartStore } from '@core/store/cart.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink, TranslocoDirective],
  selector: 'app-product-detail',
  standalone: true,
  styleUrl: './product-detail.component.scss',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  private readonly cartStore = inject(CartStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(true);
  protected readonly product = signal<Product | null>(null);
  protected readonly quantity = signal(1);
  protected readonly selectedImageIndex = signal(0);

  protected readonly isLowStock = computed(() => {
    const stock = this.product()?.stock ?? 0;
    return stock > 0 && stock <= 2;
  });

  protected readonly isOutOfStock = computed(() => (this.product()?.stock ?? 0) === 0);
  protected readonly selectedImage = computed(
    () =>
      this.product()?.images[this.selectedImageIndex()] ?? 'assets/images/placeholder-product.jpg'
  );

  protected readonly routes = ROUTES;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    id
      ? this.productService
          .getActive()
          .pipe(
            map((products) => products.find((product) => product.id === id) ?? null),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe((product) =>
            product
              ? (this.product.set(product), this.isLoading.set(false))
              : this.router.navigate(['/'])
          )
      : this.router.navigate(['/']);
  }

  protected addToCart(): void {
    const product = this.product();
    !this.isOutOfStock() && product && this.cartStore.addItem(product, this.quantity());
  }

  protected buyNow(): void {
    this.addToCart();
    this.router.navigate(['/' + ROUTES.CHECKOUT]);
  }

  protected decreaseQuantity(): void {
    this.quantity.update((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  protected increaseQuantity(): void {
    const stock = this.product()?.stock ?? 1;
    this.quantity.update((currentQuantity) => Math.min(stock, currentQuantity + 1));
  }

  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }
}
