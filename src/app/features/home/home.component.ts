import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { PRODUCT_CATEGORY } from '@core/const/product-category.const';
import { ROUTES } from '@core/const/routes';
import { SeoService } from '@core/services/seo.service';
import { OurWorkComponent } from '@features/home/our-work/our-work.component';
import { RevealDirective } from '@shared/directives/reveal.directive';

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
  imports: [NgOptimizedImage, OurWorkComponent, RevealDirective, RouterLink, TranslocoDirective],
  selector: 'app-home',
  standalone: true,
  styleUrl: './home.component.scss',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly seoService = inject(SeoService);

  protected readonly categories = CATEGORY_ITEMS;
  protected readonly routes = ROUTES;

  constructor() {
    this.seoService.update({ descriptionKey: 'seo.homeDescription', titleKey: 'seo.homeTitle' });
  }
}
