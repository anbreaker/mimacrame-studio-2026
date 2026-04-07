import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { PRODUCT_CATEGORY, ProductCategory } from '@core/const/product-category.const';
import { SeoService } from '@core/services/seo.service';
import { CatalogueStore } from '@core/store/catalogue.store';
import { ProductCardComponent } from '@shared/product-card/product-card.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ProductCardComponent, TranslocoDirective],
  selector: 'app-catalogue',
  standalone: true,
  styleUrl: './catalogue.component.scss',
  templateUrl: './catalogue.component.html',
})
export class CatalogueComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  protected readonly store = inject(CatalogueStore);

  protected readonly localSearchQuery = signal('');
  protected readonly categoryKeys = Object.values(PRODUCT_CATEGORY);

  protected readonly PRODUCT_CATEGORY = PRODUCT_CATEGORY;

  constructor() {
    this.seoService.update({
      descriptionKey: 'seo.catalogueDescription',
      titleKey: 'seo.catalogueTitle',
    });

    effect((onCleanup) => {
      const query = this.localSearchQuery();

      const timeout = setTimeout(() => this.store.search(query), 300);

      onCleanup(() => clearTimeout(timeout));
    });
  }

  ngOnInit(): void {
    this.store.clearFilters();
  }

  protected onSearch(query: string): void {
    this.localSearchQuery.set(query);
  }

  protected selectCategory(category: ProductCategory | null): void {
    this.store.selectCategory(category);
  }
}
