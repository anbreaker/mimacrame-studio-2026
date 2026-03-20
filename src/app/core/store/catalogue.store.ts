import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';

import { ProductCategory } from '@core/const/product-category.const';
import { ProductService } from '@core/services/product.service';

@Injectable({ providedIn: 'root' })
export class CatalogueStore {
  private readonly productService = inject(ProductService);

  private readonly _searchQuery = signal('');

  private readonly _selectedCategory = signal<ProductCategory | null>(null);

  private readonly _productsState = toSignal(
    this.productService.getActive().pipe(
      map((products) => ({ error: null, isLoading: false, products })),
      catchError((error: Error) => of({ error: error.message, isLoading: false, products: [] })),
      startWith({ error: null, isLoading: true, products: [] })
    ),
    { initialValue: { error: null, isLoading: true, products: [] } }
  );

  readonly error = computed(() => this._productsState().error);
  readonly products = computed(() => this._productsState().products);
  readonly filteredProducts = computed(() => {
    const query = this._searchQuery().toLowerCase().trim();
    const category = this._selectedCategory();

    return this.products().filter((product) => {
      const matchesCategory = category === null || product.category === category;
      const matchesSearch =
        query === '' ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  });

  readonly isLoading = computed(() => this._productsState().isLoading);

  readonly totalCount = computed(() => this.filteredProducts().length);

  readonly searchQuery = this._searchQuery.asReadonly();

  readonly selectedCategory = this._selectedCategory.asReadonly();

  clearFilters(): void {
    this._selectedCategory.set(null);
    this._searchQuery.set('');
  }

  search(query: string): void {
    this._searchQuery.set(query);
  }

  selectCategory(category: ProductCategory | null): void {
    this._selectedCategory.set(category);
  }
}
