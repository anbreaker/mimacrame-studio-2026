import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CatalogueStore } from '../../core/store/catalogue.store';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { PRODUCT_CATEGORY, ProductCategory } from '../../core/const/product-category.const';

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
  selector: 'app-catalogue',
  imports: [FormsModule, ProductCardComponent],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss',
})
export class CatalogueComponent implements OnInit {
  protected readonly store = inject(CatalogueStore);
  protected readonly PRODUCT_CATEGORY = PRODUCT_CATEGORY;
  protected readonly categoryLabels = CATEGORY_LABELS;
  protected readonly categoryKeys = Object.values(PRODUCT_CATEGORY);

  ngOnInit(): void {
    this.store.clearFilters();
  }

  protected selectCategory(category: ProductCategory | null): void {
    this.store.selectCategory(category);
  }

  protected onSearch(query: string): void {
    this.store.search(query);
  }
}
