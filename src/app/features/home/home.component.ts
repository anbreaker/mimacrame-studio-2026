import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PRODUCT_CATEGORY } from '@core/const/product-category.const';
import { ROUTES } from '@core/const/routes';
import { CatalogueStore } from '@core/store/catalogue.store';
import { ProductCardComponent } from '@shared/product-card/product-card.component';

const CATEGORY_ITEMS = [
  { key: PRODUCT_CATEGORY.Bracelets, label: 'Pulseras', emoji: '📿' },
  { key: PRODUCT_CATEGORY.Pendants, label: 'Colgantes', emoji: '✨' },
  { key: PRODUCT_CATEGORY.Earrings, label: 'Pendientes', emoji: '💎' },
  { key: PRODUCT_CATEGORY.Rings, label: 'Anillos', emoji: '💍' },
  { key: PRODUCT_CATEGORY.Anklets, label: 'Tobilleras', emoji: '🌊' },
  { key: PRODUCT_CATEGORY.Sets, label: 'Conjuntos', emoji: '🎁' },
] as const;

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent, RouterLink],
  selector: 'app-home',
  styleUrl: './home.component.scss',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected readonly catalogueStore = inject(CatalogueStore);
  protected readonly routes = ROUTES;
  protected readonly categories = CATEGORY_ITEMS;

  protected get featuredProducts(): ReturnType<CatalogueStore['products']> {
    return this.catalogueStore.products().slice(0, 4);
  }
}
