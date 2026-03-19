import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductCategory } from '@core/const/product-category.const';
import { Product } from '@core/interfaces/product.interface';
import { ProductService } from '@core/services/product.service';

interface CatalogueState {
  error: string | null;
  isLoading: boolean;
  products: Product[];
  searchQuery: string;
  selectedCategory: ProductCategory | null;
}

const initialState: CatalogueState = {
  error: null,
  isLoading: true,
  products: [],
  searchQuery: '',
  selectedCategory: null,
};

@Injectable({ providedIn: 'root' })
export class CatalogueStore {
  private readonly productService = inject(ProductService);

  private readonly _error = signal<string | null>(initialState.error);
  private readonly _isLoading = signal(initialState.isLoading);
  private readonly _products = signal<Product[]>(initialState.products);
  private readonly _searchQuery = signal(initialState.searchQuery);
  private readonly _selectedCategory = signal<ProductCategory | null>(
    initialState.selectedCategory
  );

  readonly filteredProducts = computed(() => {
    const query = this._searchQuery().toLowerCase().trim();
    const category = this._selectedCategory();

    return this._products().filter((product) => {
      const matchesCategory = category === null || product.category === category;
      const matchesSearch =
        query === '' ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  });

  readonly totalCount = computed(() => this.filteredProducts().length);

  readonly error = this._error.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly products = this._products.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();

  constructor() {
    this.productService
      .getActive()
      .pipe(takeUntilDestroyed())
      .subscribe({
        error: (err: Error) => {
          this._error.set(err.message);
          this._isLoading.set(false);
        },
        next: (products) => {
          this._products.set(products);
          this._isLoading.set(false);
        },
      });
  }

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
