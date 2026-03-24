import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

import { I18nService } from '@core/services/i18n.service';

interface Language {
  code: string;
  flag: string;
  label: string;
}

const LANGUAGES: Language[] = [
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'pt', flag: '🇵🇹', label: 'Português' },
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-lang-selector',
  standalone: true,
  styleUrl: './lang-selector.component.scss',
  templateUrl: './lang-selector.component.html',
})
export class LangSelectorComponent {
  private readonly i18n = inject(I18nService);
  private readonly transloco = inject(TranslocoService);

  protected readonly languages = LANGUAGES;
  protected readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected setLang(code: string): void {
    this.i18n.setLang(code);
  }
}
