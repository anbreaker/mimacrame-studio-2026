import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { CuratedPost, CuratedPostSection } from '@core/interfaces/curated-post.interface';
import { CuratedPostsService } from '@core/services/curated-posts.service';
import { UploadService } from '@core/services/upload.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

interface PostFormData {
  active: boolean;
  caption: string;
  imageUrl: string;
  instagramUrl: string;
  order: number;
  section: CuratedPostSection;
  title: string;
}

const EMPTY_FORM: PostFormData = {
  active: true,
  caption: '',
  imageUrl: '',
  instagramUrl: '',
  order: 0,
  section: 'home',
  title: '',
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, FormsModule, TranslocoDirective],
  selector: 'app-admin-posts',
  standalone: true,
  styleUrl: './admin-posts.component.scss',
  templateUrl: './admin-posts.component.html',
})
export class AdminPostsComponent {
  private readonly curatedPostsService = inject(CuratedPostsService);
  private readonly uploadService = inject(UploadService);

  private readonly _posts = toSignal(this.curatedPostsService.getAll(), { initialValue: [] });

  protected readonly posts = computed(() => this._posts());
  protected readonly isLoading = computed(() => this._posts() === undefined);
  protected readonly totalCount = computed(() => this._posts().length);
  protected readonly activeCount = computed(() => this._posts().filter((p) => p.active).length);
  protected readonly inactiveCount = computed(() => this._posts().filter((p) => !p.active).length);

  protected readonly editingId = signal<string | null>(null);
  protected readonly formData = signal<PostFormData | null>(null);
  protected readonly saving = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly confirmDeleteId = signal<string | null>(null);
  private readonly _pendingImageFile = signal<File | null>(null);

  protected readonly isEditMode = computed(() => !!this.editingId());
  protected readonly isPanelOpen = computed(() => this.formData() !== null);

  protected openCreate(): void {
    this.editingId.set(null);
    this.formData.set({ ...EMPTY_FORM });
    this.formError.set(null);
  }

  protected openEdit(post: CuratedPost): void {
    this.editingId.set(post.id);
    this.formData.set({
      active: post.active,
      caption: post.caption,
      imageUrl: post.imageUrl,
      instagramUrl: post.instagramUrl,
      order: post.order,
      section: post.section,
      title: post.title,
    });
    this.formError.set(null);
  }

  protected closePanel(): void {
    this.editingId.set(null);
    this.formData.set(null);
    this.formError.set(null);
    this._pendingImageFile.set(null);
  }

  protected onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this._pendingImageFile.set(file);
    const previewUrl = URL.createObjectURL(file);
    this.formData.update((d) => (d ? { ...d, imageUrl: previewUrl } : d));
  }

  protected async save(): Promise<void> {
    const data = this.formData();
    if (!data || !data.title.trim()) return;

    const pendingFile = this._pendingImageFile();
    const isCreate = !this.editingId();

    if (isCreate && !pendingFile && !data.imageUrl) return;

    this.saving.set(true);
    this.formError.set(null);

    try {
      let imageUrl = data.imageUrl;

      if (pendingFile) {
        const id = this.editingId() ?? `post_${Date.now()}`;
        imageUrl = await this.uploadService.uploadPostImage(pendingFile, id);
      }

      const id = this.editingId();
      const obs$ = id
        ? this.curatedPostsService.update(id, { ...data, imageUrl })
        : this.curatedPostsService.create({ ...data, imageUrl });

      obs$.subscribe({
        error: () => {
          this.saving.set(false);
          this.formError.set('admin.posts.errors.save');
        },
        next: () => {
          this.saving.set(false);
          this._pendingImageFile.set(null);
          this.closePanel();
        },
      });
    } catch {
      this.saving.set(false);
      this.formError.set('admin.posts.errors.upload');
    }
  }

  protected requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }

  protected cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  protected confirmDelete(): void {
    const id = this.confirmDeleteId();
    if (!id) return;
    this.curatedPostsService.delete(id).subscribe({
      next: () => this.confirmDeleteId.set(null),
    });
  }
}
