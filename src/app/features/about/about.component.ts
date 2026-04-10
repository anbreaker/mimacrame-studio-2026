import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { SeoService } from '@core/services/seo.service';

const VALUES = ['craft', 'materials', 'story'] as const;

type Value = (typeof VALUES)[number];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoDirective],
  selector: 'app-about',
  standalone: true,
  styleUrl: './about.component.scss',
  templateUrl: './about.component.html',
})
export class AboutComponent {
  private readonly seoService = inject(SeoService);

  protected readonly routes = ROUTES;
  protected readonly values: readonly Value[] = VALUES;
  protected readonly ctaVisible = signal(false);

  private readonly ctaSection = viewChild<ElementRef>('ctaSection');

  constructor() {
    this.seoService.update({
      descriptionKey: 'seo.aboutDescription',
      titleKey: 'seo.aboutTitle',
    });

    afterNextRender(() => {
      const el = this.ctaSection()?.nativeElement;
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.ctaVisible.set(true);
            observer.disconnect();
          }
        },
        { threshold: 0.25 },
      );

      observer.observe(el);
    });
  }
}
