import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { Observable } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { AVAILABLE_LANGS, LANG, Lang } from '@core/const/lang.const';
import { CuratedPost, CuratedPostSection } from '@core/interfaces/curated-post.interface';
import { LocalizedString } from '@core/interfaces/product.interface';
import { CuratedPostsService } from '@core/services/curated-posts.service';
import { TranslationService } from '@core/services/translation.service';
import { UploadService } from '@core/services/upload.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

interface PostFormData {
  active: boolean;
  imageUrl: string;
  instagramUrl: string;
  order: number;
  section: CuratedPostSection;
}

const EMPTY_LOCALIZED: LocalizedString = { en: '', es: '', pt: '' };

const EMPTY_FORM: PostFormData = {
  active: true,
  imageUrl: '',
  instagramUrl: '',
  order: 0,
  section: 'home',
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, FormField, TranslocoDirective],
  selector: 'app-admin-posts',
  standalone: true,
  styleUrl: './admin-posts.component.scss',
  templateUrl: './admin-posts.component.html',
})
export class AdminPostsComponent {
  private readonly curatedPostsService = inject(CuratedPostsService);
  private readonly uploadService = inject(UploadService);
  protected readonly translationService = inject(TranslationService);

  private readonly _pendingImageFile = signal<File | null>(null);

  protected readonly activeLang = signal<Lang>(LANG.Es);
  protected readonly availableLangs = AVAILABLE_LANGS;
  protected readonly captionByLang = signal<LocalizedString>({ ...EMPTY_LOCALIZED });
  protected readonly confirmDeleteId = signal<string | null>(null);
  protected readonly editingId = signal<string | null>(null);
  protected readonly formError = signal<string | null>(null);
  protected readonly isPanelOpen = signal(false);
  protected readonly postModel = signal<PostFormData>({ ...EMPTY_FORM });
  protected readonly saving = signal(false);
  protected readonly titleByLang = signal<LocalizedString>({ ...EMPTY_LOCALIZED });
  protected readonly translateError = signal<string | null>(null);

  protected readonly postForm = form(this.postModel);

  private readonly _posts = toSignal(this.curatedPostsService.getAll(), { initialValue: [] });

  protected readonly activeCount = computed(
    () => this._posts().filter((post) => post.active).length
  );
  protected readonly inactiveCount = computed(
    () => this._posts().filter((post) => !post.active).length
  );
  protected readonly isEditMode = computed(() => !!this.editingId());
  protected readonly isLoading = computed(() => this._posts() === undefined);
  protected readonly posts = computed(() => this._posts());
  protected readonly totalCount = computed(() => this._posts().length);

  protected openCreate(): void {
    this.editingId.set(null);
    this.activeLang.set(LANG.Es);
    this.titleByLang.set({ ...EMPTY_LOCALIZED });
    this.captionByLang.set({ ...EMPTY_LOCALIZED });
    this.postModel.set({ ...EMPTY_FORM });
    this.formError.set(null);
    this.translateError.set(null);
    this.isPanelOpen.set(true);
  }

  protected openEdit(post: CuratedPost): void {
    this.editingId.set(post.id);
    this.activeLang.set(LANG.Es);

    this.titleByLang.set(
      typeof post.title === 'string'
        ? { ...EMPTY_LOCALIZED, es: post.title }
        : { ...EMPTY_LOCALIZED, ...post.title }
    );

    this.captionByLang.set(
      typeof post.caption === 'string'
        ? { ...EMPTY_LOCALIZED, es: post.caption }
        : { ...EMPTY_LOCALIZED, ...post.caption }
    );

    this.postModel.set({
      active: post.active,
      imageUrl: post.imageUrl,
      instagramUrl: post.instagramUrl,
      order: post.order,
      section: post.section,
    });

    this.formError.set(null);
    this.translateError.set(null);
    this.isPanelOpen.set(true);
  }

  protected closePanel(): void {
    this.isPanelOpen.set(false);
    this.editingId.set(null);
    this.titleByLang.set({ ...EMPTY_LOCALIZED });
    this.captionByLang.set({ ...EMPTY_LOCALIZED });
    this.formError.set(null);
    this.translateError.set(null);
    this._pendingImageFile.set(null);
  }

  protected onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this._pendingImageFile.set(file);
    this.postModel.update((current) => ({ ...current, imageUrl: URL.createObjectURL(file) }));
  }

  protected updateTitle(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const lang = this.activeLang();
    this.titleByLang.update((current) => ({ ...current, [lang]: value }));
  }

  protected updateCaption(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    const lang = this.activeLang();
    this.captionByLang.update((current) => ({ ...current, [lang]: value }));
  }

  protected async autoTranslateAll(): Promise<void> {
    const title = this.titleByLang()[LANG.Es];
    const caption = this.captionByLang()[LANG.Es];
    if (!title.trim() && !caption.trim()) return;

    this.translateError.set(null);

    try {
      const result = await this.translationService.translateAll(title, caption);
      this.titleByLang.update((current) => ({ ...current, en: result.nameEn, pt: result.namePt }));
      this.captionByLang.update((current) => ({ ...current, en: result.descEn, pt: result.descPt }));
    } catch {
      this.translateError.set('admin.posts.errors.translate');
    }
  }

  protected async save(): Promise<void> {
    const data = this.postModel();
    if (!this.titleByLang()[LANG.Es].trim()) return;

    const pendingFile = this._pendingImageFile();
    if (!this.editingId() && !pendingFile && !data.imageUrl) return;

    this.saving.set(true);
    this.formError.set(null);

    try {
      const imageUrl = pendingFile
        ? await this.uploadService.uploadPostImage(
            pendingFile,
            this.editingId() ?? `post_${Date.now()}`
          )
        : data.imageUrl;

      const payload = {
        ...data,
        caption: this.captionByLang(),
        imageUrl,
        title: this.titleByLang(),
      };

      const id = this.editingId();
      const obs$: Observable<string | void> = id
        ? this.curatedPostsService.update(id, payload)
        : this.curatedPostsService.create(payload);

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

  protected getTitleForDisplay(post: CuratedPost): string {
    return typeof post.title === 'string' ? post.title : post.title.es || post.title.en || '';
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
