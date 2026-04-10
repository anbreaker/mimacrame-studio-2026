import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { SeoService } from '@core/services/seo.service';
import { RevealDirective } from '@shared/directives/reveal.directive';

const VALUES = ['craft', 'materials', 'story'] as const;

type Value = (typeof VALUES)[number];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, RouterLink, TranslocoDirective],
  selector: 'app-about',
  standalone: true,
  styleUrl: './about.component.scss',
  templateUrl: './about.component.html',
})
export class AboutComponent {
  private readonly seoService = inject(SeoService);

  protected readonly routes = ROUTES;
  protected readonly values: readonly Value[] = VALUES;

  constructor() {
    this.seoService.update({
      descriptionKey: 'seo.aboutDescription',
      titleKey: 'seo.aboutTitle',
    });
  }
}
