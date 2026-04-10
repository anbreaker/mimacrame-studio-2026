import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { SORT_DIR, SORT_FIELD, SortDir, SortField } from '@core/const/sort.const';
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
  protected readonly searchQuery = signal('');
  protected readonly sortDir = signal<SortDir>(SORT_DIR.Asc);
  protected readonly sortField = signal<SortField>(SORT_FIELD.Name);

  private readonly _products = toSignal(this.productService.getAll(), { initialValue: [] });
  protected readonly filteredProducts = computed(() => {
    const allProducts = this._products();
    const searchQuery = this.searchQuery().toLowerCase().trim();
    const activeSortField = this.sortField();
    const activeSortDir = this.sortDir();

    const matchingProducts = searchQuery
      ? allProducts.filter((product) =>
          Object.values(product.name).some((localizedName) =>
            localizedName.toLowerCase().includes(searchQuery)
          )
        )
      : [...allProducts];

    return matchingProducts.sort((productA, productB) => {
      const directionMultiplier = activeSortDir === SORT_DIR.Asc ? 1 : -1;
      return directionMultiplier * this.compareByField(productA, productB, activeSortField);
    });
  });

  protected readonly isLoading = computed(() => this._products() === undefined);

  protected readonly routes = ROUTES;

  protected readonly SORT_DIR = SORT_DIR;

  protected readonly SORT_FIELD = SORT_FIELD;

  protected cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  private compareByField(productA: Product, productB: Product, field: SortField): number {
    switch (field) {
      case SORT_FIELD.Name: {
        const nameA = typeof productA.name === 'string' ? productA.name : productA.name.es;
        const nameB = typeof productB.name === 'string' ? productB.name : productB.name.es;
        return nameA.localeCompare(nameB, 'es');
      }
      case SORT_FIELD.Price:
        return productA.price - productB.price;
      case SORT_FIELD.Category:
        return productA.category.localeCompare(productB.category, 'es');
      case SORT_FIELD.Active:
        return Number(productB.active) - Number(productA.active);
    }
  }

  protected async confirmDelete(): Promise<void> {
    const targetId = this.confirmDeleteId();
    if (!targetId) return;

    try {
      await firstValueFrom(this.productService.delete(targetId));
      this.confirmDeleteId.set(null);
    } catch {
      // deletion failed silently
    }
  }

  protected onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected requestDelete(productId: string): void {
    this.confirmDeleteId.set(productId);
  }

  protected sort(field: SortField): void {
    this.sortField() === field
      ? this.sortDir.update((currentDir) =>
          currentDir === SORT_DIR.Asc ? SORT_DIR.Desc : SORT_DIR.Asc
        )
      : this.sortField.set(field);
    this.sortDir.set(SORT_DIR.Asc);
  }
}
