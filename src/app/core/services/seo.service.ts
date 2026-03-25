import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslocoEvents, TranslocoService } from '@jsverse/transloco';
import { filter } from 'rxjs';

/** Use titleKey/descriptionKey for i18n pages (reactive to language changes).
 *  Use title/description for dynamic DB content (product name, etc.). */
export interface SeoConfig {
  description?: string;
  descriptionKey?: string;
  image?: string;
  title?: string;
  titleKey?: string;
}

const BASE_TITLE = 'Mimacramé Studio';

const LOCALE_MAP: Record<string, string> = {
  en: 'en_GB',
  es: 'es_ES',
  pt: 'pt_PT',
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly transloco = inject(TranslocoService);

  private currentConfig: SeoConfig | null = null;

  constructor() {
    this.transloco.events$
      .pipe(filter((e: TranslocoEvents) => e.type === 'translationLoadSuccess'))
      .subscribe(() => {
        const lang = this.transloco.getActiveLang();
        document.documentElement.lang = lang;
        this.meta.updateTag({ content: LOCALE_MAP[lang] ?? lang, property: 'og:locale' });

        if (this.currentConfig) {
          this.applyConfig(this.currentConfig);
        }
      });
  }

  resetToDefaults(): void {
    this.update({ descriptionKey: 'seo.homeDescription', titleKey: 'seo.homeTitle' });
  }

  update(config: SeoConfig): void {
    this.currentConfig = config;
    this.applyConfig(config);
  }

  private applyConfig(config: SeoConfig): void {
    const rawTitle: string = config.titleKey
      ? (this.transloco.translate(config.titleKey) as string)
      : (config.title ?? BASE_TITLE);

    const rawDescription: string = config.descriptionKey
      ? (this.transloco.translate(config.descriptionKey) as string)
      : (config.description ?? (this.transloco.translate('seo.homeDescription') as string));

    const fullTitle = rawTitle.includes(BASE_TITLE)
      ? rawTitle
      : `${rawTitle} — ${BASE_TITLE}`;

    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({ content: rawDescription, name: 'description' });
    this.meta.updateTag({ content: fullTitle, property: 'og:title' });
    this.meta.updateTag({ content: rawDescription, property: 'og:description' });

    if (config.image) {
      this.meta.updateTag({ content: config.image, property: 'og:image' });
    }
  }
}
