import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, ROUTES } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { PRODUCT_CATEGORY, ProductCategory } from '@core/const/product-category.const';
import { Product } from '@core/interfaces/product.interface';
import { ProductService } from '@core/services/product.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, CurrencyPipe, RouterLink, TranslocoDirective],
  selector: 'app-products-list',
  standalone: true,
  styleUrl: './products-list.component.scss',
  templateUrl: './products-list.component.html',
})
export class ProductsListComponent {
  private readonly productService = inject(ProductService);

  protected readonly confirmDeleteId = signal<string | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly products = signal<Product[]>([]);
  protected readonly searchQuery = signal('');

  protected readonly routes = ROUTES;

  constructor() {
    this.productService
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe((products) => {
        this.products.set(products);
        this.isLoading.set(false);
      });
  }

  protected cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  protected confirmDelete(): void {
    const id = this.confirmDeleteId();
    id && this.productService.delete(id).subscribe(() => this.confirmDeleteId.set(null));
  }

  protected get filteredProducts(): Product[] {
    const q = this.searchQuery().toLowerCase().trim();
    return q
      ? this.products().filter((product) => product.name.toLowerCase().includes(q))
      : this.products();
  }

  protected requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }
}
