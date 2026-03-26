import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
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

  private readonly _products = toSignal(this.productService.getAll(), { initialValue: [] });

  protected readonly filteredProducts = computed(() => {
    const products = this._products();
    const query = this.searchQuery().toLowerCase().trim();

    return query
      ? products.filter((p) =>
          Object.values(p.name).some((nameValue) => nameValue.toLowerCase().includes(query))
        )
      : products;
  });

  protected readonly isLoading = computed(() => this._products() === undefined);
  protected readonly routes = ROUTES;

  protected cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  protected confirmDelete(): void {
    const id = this.confirmDeleteId();
    if (!id) return;

    this.productService.delete(id).subscribe({
      next: () => this.confirmDeleteId.set(null),
    });
  }

  protected requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }

  protected updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
