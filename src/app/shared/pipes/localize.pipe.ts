import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { LANG } from '@core/const/lang.const';
import { LocalizedString } from '@core/interfaces/product.interface';

@Pipe({ name: 'localize', pure: true, standalone: true })
export class LocalizePipe implements PipeTransform {
  private readonly transloco = inject(TranslocoService);

  transform(value: LocalizedString | string, lang?: string): string {
    if (typeof value === 'string') return value;
    const activeLang = lang ?? this.transloco.getActiveLang();
    return value[activeLang as keyof LocalizedString] || value[LANG.Es] || '';
  }
}
