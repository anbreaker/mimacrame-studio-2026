import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, ROUTES } from '@angular/router';

import { PRODUCT_CATEGORY, ProductCategory } from '@core/const/product-category.const';
import { Product } from '@core/interfaces/product.interface';
import { ProductService } from '@core/services/product.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [PRODUCT_CATEGORY.Bracelets]: 'Pulseras',
  [PRODUCT_CATEGORY.Pendants]: 'Colgantes',
  [PRODUCT_CATEGORY.Earrings]: 'Pendientes',
  [PRODUCT_CATEGORY.Rings]: 'Anillos',
  [PRODUCT_CATEGORY.Anklets]: 'Tobilleras',
  [PRODUCT_CATEGORY.Sets]: 'Conjuntos',
};

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, CurrencyPipe, RouterLink],
  selector: 'app-products-list',
  styleUrl: './products-list.component.scss',
  templateUrl: './products-list.component.html',
})
export class ProductsListComponent {
  private readonly productService = inject(ProductService);

  protected readonly categoryLabels = CATEGORY_LABELS;
  protected readonly confirmDeleteId = signal<string | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly products = signal<Product[]>([]);
  protected readonly routes = ROUTES;
  protected readonly searchQuery = signal('');

  protected get filteredProducts(): Product[] {
    const q = this.searchQuery().toLowerCase().trim();
    return q ? this.products().filter((p) => p.name.toLowerCase().includes(q)) : this.products();
  }

  constructor() {
    this.productService
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe((products) => {
        this.products.set(products);
        this.isLoading.set(false);
      });
  }

  protected requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }

  protected cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  protected confirmDelete(): void {
    const id = this.confirmDeleteId();
    id && this.productService.delete(id).subscribe(() => this.confirmDeleteId.set(null));
  }
}
