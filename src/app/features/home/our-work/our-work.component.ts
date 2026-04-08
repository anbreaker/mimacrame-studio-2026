import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';

import { CuratedPostsService } from '@core/services/curated-posts.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  selector: 'app-our-work',
  standalone: true,
  styleUrl: './our-work.component.scss',
  templateUrl: './our-work.component.html',
})
export class OurWorkComponent {
  private readonly curatedPostsService = inject(CuratedPostsService);

  private readonly _posts = toSignal(this.curatedPostsService.getActive('home'), {
    initialValue: [],
  });

  protected readonly posts = computed(() => this._posts().slice(0, 6));
  protected readonly isLoading = computed(() => this._posts() === undefined);
  protected readonly hasPosts = computed(() => this.posts().length > 0);
}
