import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PRODUCT_CATEGORY, ProductCategory } from '@core/const/product-category.const';
import { CatalogueStore } from '@core/store/catalogue.store';
import { ProductCardComponent } from '@shared/product-card/product-card.component';

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [PRODUCT_CATEGORY.Anklets]: 'Tobilleras',
  [PRODUCT_CATEGORY.Bracelets]: 'Pulseras',
  [PRODUCT_CATEGORY.Earrings]: 'Pendientes',
  [PRODUCT_CATEGORY.Pendants]: 'Colgantes',
  [PRODUCT_CATEGORY.Rings]: 'Anillos',
  [PRODUCT_CATEGORY.Sets]: 'Conjuntos',
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ProductCardComponent],
  selector: 'app-catalogue',
  standalone: true,
  styleUrl: './catalogue.component.scss',
  templateUrl: './catalogue.component.html',
})
export class CatalogueComponent implements OnInit {
  protected readonly store = inject(CatalogueStore);

  protected readonly categoryKeys = Object.values(PRODUCT_CATEGORY);
  protected readonly categoryLabels = CATEGORY_LABELS;
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
