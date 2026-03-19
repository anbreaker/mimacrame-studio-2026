import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

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
  imports: [TranslocoDirective],
  selector: 'app-lang-selector',
  standalone: true,
  styleUrl: './lang-selector.component.scss',
  templateUrl: './lang-selector.component.html',
})
export class LangSelectorComponent {
  private readonly transloco = inject(TranslocoService);

  protected readonly languages = LANGUAGES;

  protected setLang(code: string): void {
    this.transloco.setActiveLang(code);
  }
}
