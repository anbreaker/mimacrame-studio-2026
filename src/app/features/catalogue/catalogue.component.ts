import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { PRODUCT_CATEGORY, ProductCategory } from '@core/const/product-category.const';
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
  protected readonly store = inject(CatalogueStore);

  protected readonly categoryKeys = Object.values(PRODUCT_CATEGORY);
  protected readonly PRODUCT_CATEGORY = PRODUCT_CATEGORY;

  ngOnInit(): void {
    this.store.clearFilters();
  }

  protected onSearch(query: string): void {
    this.store.search(query);
  }

  protected selectCategory(category: ProductCategory | null): void {
    this.store.selectCategory(category);
  }
}
