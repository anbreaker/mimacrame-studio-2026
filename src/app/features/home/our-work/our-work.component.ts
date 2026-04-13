import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { Lang } from '@core/const/lang.const';
import { LocalizedString } from '@core/interfaces/product.interface';
import { CuratedPostsService } from '@core/services/curated-posts.service';
import { RevealDirective } from '@shared/directives/reveal.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, TranslocoDirective],
  selector: 'app-our-work',
  standalone: true,
  styleUrl: './our-work.component.scss',
  templateUrl: './our-work.component.html',
})
export class OurWorkComponent {
  private readonly curatedPostsService = inject(CuratedPostsService);
  private readonly transloco = inject(TranslocoService);

  private readonly _posts = toSignal(this.curatedPostsService.getActive('home'), {
    initialValue: [],
  });

  protected readonly posts = computed(() => this._posts().slice(0, 6));

  protected readonly hasPosts = computed(() => this.posts().length > 0);

  protected readonly isLoading = computed(() => this._posts() === undefined);

  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected resolveLocalized(value: LocalizedString | string): string {
    if (typeof value === 'string') return value;

    const lang = this.activeLang() as Lang;
    return value[lang] || value['es'] || '';
  }
}
