import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { ProductService } from '../../core/services/product.service';
import { CartStore } from '../../core/store/cart.store';
import { Product } from '../../core/interfaces/product.interface';
import { ROUTES } from '../../core/const/routes';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-detail',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly cartStore = inject(CartStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly routes = ROUTES;
  protected readonly product = signal<Product | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly selectedImageIndex = signal(0);
  protected readonly quantity = signal(1);

  protected readonly selectedImage = computed(
    () =>
      this.product()?.images[this.selectedImageIndex()] ?? 'assets/images/placeholder-product.jpg'
  );

  protected readonly isOutOfStock = computed(() => (this.product()?.stock ?? 0) === 0);
  protected readonly isLowStock = computed(() => {
    const stock = this.product()?.stock ?? 0;
    return stock > 0 && stock <= 2;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    id
      ? this.productService
          .getActive()
          .pipe(
            map((products) => products.find((p) => p.id === id) ?? null),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe((product) =>
            product
              ? (this.product.set(product), this.isLoading.set(false))
              : this.router.navigate(['/'])
          )
      : this.router.navigate(['/']);
  }

  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  protected decreaseQuantity(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  protected increaseQuantity(): void {
    const stock = this.product()?.stock ?? 1;
    this.quantity.update((q) => Math.min(stock, q + 1));
  }

  protected addToCart(): void {
    const product = this.product();
    !this.isOutOfStock() && product && this.cartStore.addItem(product, this.quantity());
  }

  protected buyNow(): void {
    this.addToCart();
    this.router.navigate(['/' + ROUTES.CHECKOUT]);
  }
}
