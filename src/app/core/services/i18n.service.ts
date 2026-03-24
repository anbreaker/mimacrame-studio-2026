import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { AVAILABLE_LANGS, DEFAULT_LANG, LANG, Lang } from '@core/const/lang.const';
import { STORAGE_KEYS } from '@core/const/storage-keys.const';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly transloco = inject(TranslocoService);

  private detectBrowserLang(): Lang {
    const browser = navigator.language.toLowerCase();
    if (browser.startsWith(LANG.Es)) return LANG.Es;
    if (browser.startsWith(LANG.Pt)) return LANG.Pt;
    return DEFAULT_LANG;
  }

  private getSavedLang(): Lang | null {
    const saved = localStorage.getItem(STORAGE_KEYS.Lang);
    return AVAILABLE_LANGS.includes(saved as Lang) ? (saved as Lang) : null;
  }

  initialize(): void {
    const lang = this.getSavedLang() ?? this.detectBrowserLang();
    this.transloco.setActiveLang(lang);
  }

  setLang(code: string): void {
    this.transloco.setActiveLang(code);
    localStorage.setItem(STORAGE_KEYS.Lang, code);
  }
}
