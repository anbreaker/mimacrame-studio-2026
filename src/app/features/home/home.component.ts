import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { PRODUCT_CATEGORY } from '@core/const/product-category.const';
import { ROUTES } from '@core/const/routes';
import { CatalogueStore } from '@core/store/catalogue.store';
import { ProductCardComponent } from '@shared/product-card/product-card.component';

const CATEGORY_ITEMS = [
  { emoji: '📿', key: PRODUCT_CATEGORY.Bracelets },
  { emoji: '✨', key: PRODUCT_CATEGORY.Pendants },
  { emoji: '💎', key: PRODUCT_CATEGORY.Earrings },
  { emoji: '💍', key: PRODUCT_CATEGORY.Rings },
  { emoji: '🌊', key: PRODUCT_CATEGORY.Anklets },
  { emoji: '🎁', key: PRODUCT_CATEGORY.Sets },
] as const;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent, RouterLink, TranslocoDirective],
  selector: 'app-home',
  standalone: true,
  styleUrl: './home.component.scss',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected readonly catalogueStore = inject(CatalogueStore);

  protected readonly categories = CATEGORY_ITEMS;
  protected readonly routes = ROUTES;

  protected get featuredProducts(): ReturnType<CatalogueStore['products']> {
    return this.catalogueStore.products().slice(0, 4);
  }
}
