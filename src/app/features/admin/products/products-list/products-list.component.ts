import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductService } from '../../../../core/services/product.service';
import { AdminNavComponent } from '../../../../shared/admin-nav/admin-nav.component';
import { Product } from '../../../../core/interfaces/product.interface';
import { PRODUCT_CATEGORY, ProductCategory } from '../../../../core/const/product-category.const';
import { ROUTES } from '../../../../core/const/routes';

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
  selector: 'app-products-list',
  imports: [RouterLink, CurrencyPipe, AdminNavComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  private readonly productService = inject(ProductService);

  protected readonly routes = ROUTES;
  protected readonly categoryLabels = CATEGORY_LABELS;
  protected readonly products = signal<Product[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly searchQuery = signal('');
  protected readonly confirmDeleteId = signal<string | null>(null);

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
