import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { CuratedPost } from '@core/interfaces/curated-post.interface';
import { CuratedPostsService } from '@core/services/curated-posts.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, RouterLink, TranslocoDirective],
  selector: 'app-posts-list',
  standalone: true,
  styleUrl: './posts-list.component.scss',
  templateUrl: './posts-list.component.html',
})
export class PostsListComponent {
  private readonly curatedPostsService = inject(CuratedPostsService);

  protected readonly confirmDeleteId = signal<string | null>(null);

  private readonly _posts = toSignal(this.curatedPostsService.getAll(), { initialValue: [] });

  protected readonly activeCount = computed(
    () => this._posts().filter((post) => post.active).length
  );

  protected readonly inactiveCount = computed(
    () => this._posts().filter((post) => !post.active).length
  );

  protected readonly isLoading = computed(() => this._posts() === undefined);
  protected readonly posts = computed(() => this._posts());
  protected readonly totalCount = computed(() => this._posts().length);
  protected readonly routes = ROUTES;

  protected cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  protected async confirmDelete(): Promise<void> {
    const id = this.confirmDeleteId();
    if (!id) return;
    try {
      await firstValueFrom(this.curatedPostsService.delete(id));
      this.confirmDeleteId.set(null);
    } catch {
      // deletion failed silently
    }
  }

  protected getTitleForDisplay(post: CuratedPost): string {
    return typeof post.title === 'string' ? post.title : post.title.es || post.title.en || '';
  }

  protected requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }
}
