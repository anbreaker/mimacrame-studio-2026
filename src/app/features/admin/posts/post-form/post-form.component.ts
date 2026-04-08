import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, map, Observable, of, switchMap, take } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { AVAILABLE_LANGS, LANG, Lang } from '@core/const/lang.const';
import { ROUTES } from '@core/const/routes';
import {
  CuratedPostCreate,
  CuratedPostSection,
  CuratedPostUpdate,
} from '@core/interfaces/curated-post.interface';
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
  videoUrl?: string;
}

const EMPTY_LOCALIZED: LocalizedString = { en: '', es: '', pt: '' };

const EMPTY_FORM: PostFormData = {
  active: true,
  imageUrl: '',
  instagramUrl: '',
  order: 0,
  section: 'home',
  videoUrl: '',
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, FormField, RouterLink, TranslocoDirective],
  selector: 'app-post-form',
  standalone: true,
  styleUrl: './post-form.component.scss',
  templateUrl: './post-form.component.html',
})
export class PostFormComponent {
  private readonly curatedPostsService = inject(CuratedPostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly translationService = inject(TranslationService);
  protected readonly uploadService = inject(UploadService);

  protected readonly activeLang = signal<Lang>(LANG.Es);
  protected readonly availableLangs = AVAILABLE_LANGS;
  protected readonly captionByLang = signal<LocalizedString>({ ...EMPTY_LOCALIZED });
  protected readonly formError = signal<string | null>(null);
  protected readonly postModel = signal<PostFormData>({ ...EMPTY_FORM });
  protected readonly routes = ROUTES;
  protected readonly saving = signal(false);
  protected readonly titleByLang = signal<LocalizedString>({ ...EMPTY_LOCALIZED });
  protected readonly translateError = signal<string | null>(null);

  protected readonly postForm = form(this.postModel);

  private readonly _pendingImageFile = signal<File | null>(null);
  private readonly _pendingVideoFile = signal<File | null>(null);

  private readonly _postId = toSignal(this.route.paramMap.pipe(map((params) => params.get('id'))));

  protected readonly isEditMode = computed(() => !!this._postId());

  private readonly _postData = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((id) =>
        id
          ? this.curatedPostsService.getAll().pipe(
              map((posts) => posts.find((post) => post.id === id) ?? null),
              filter((post) => post !== null),
              take(1)
            )
          : of(null)
      )
    )
  );

  constructor() {
    effect(() => {
      const data = this._postData();
      if (data) {
        untracked(() => {
          this.postModel.set({
            active: data.active,
            imageUrl: data.imageUrl,
            instagramUrl: data.instagramUrl ?? '',
            order: data.order,
            section: data.section,
            videoUrl: data.videoUrl ?? '',
          });

          this.titleByLang.set(
            typeof data.title === 'string'
              ? { en: data.title, es: data.title, pt: data.title }
              : { ...EMPTY_LOCALIZED, ...data.title }
          );

          this.captionByLang.set(
            typeof data.caption === 'string'
              ? { en: data.caption, es: data.caption, pt: data.caption }
              : { ...EMPTY_LOCALIZED, ...data.caption }
          );
        });
      }
    });
  }

  protected async autoTranslateAll(): Promise<void> {
    const title = this.titleByLang()[LANG.Es];
    const caption = this.captionByLang()[LANG.Es];
    if (!title.trim() && !caption.trim()) return;

    this.translateError.set(null);

    try {
      const result = await this.translationService.translateAll(title, caption);
      this.titleByLang.update((current) => ({ ...current, en: result.nameEn, pt: result.namePt }));
      this.captionByLang.update((current) => ({
        ...current,
        en: result.descEn,
        pt: result.descPt,
      }));
    } catch {
      this.translateError.set('admin.posts.errors.translate');
    }
  }

  protected onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this._pendingImageFile.set(file);
    this._pendingVideoFile.set(null);
    this.postModel.update((current) => ({
      ...current,
      imageUrl: URL.createObjectURL(file),
      videoUrl: '',
    }));
  }

  protected onVideoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this._pendingVideoFile.set(file);
    this._pendingImageFile.set(null);
    this.postModel.update((current) => ({
      ...current,
      videoUrl: URL.createObjectURL(file),
      imageUrl: '',
    }));
  }

  protected async save(): Promise<void> {
    const data = this.postModel();
    if (!this.titleByLang()[LANG.Es].trim()) return;

    const pendingFile = this._pendingImageFile();
    const pendingVideoFile = this._pendingVideoFile();
    if (!this.isEditMode() && !pendingFile && !data.imageUrl && !pendingVideoFile && !data.videoUrl)
      return;

    this.saving.set(true);
    this.formError.set(null);

    try {
      const id = this._postId();
      const folderId = id ?? `post_${Date.now()}`;

      const imageUrl = pendingFile
        ? await this.uploadService.uploadPostImage(pendingFile, folderId)
        : data.imageUrl;

      const videoUrl = pendingVideoFile
        ? await this.uploadService.uploadPostVideo(pendingVideoFile, folderId)
        : data.videoUrl;

      const payload = {
        ...data,
        caption: this.captionByLang(),
        imageUrl,
        videoUrl,
        title: this.titleByLang(),
      };

      const obs$: Observable<string | void> =
        this.isEditMode() && id
          ? this.curatedPostsService.update(id, payload as CuratedPostUpdate)
          : this.curatedPostsService.create(payload as CuratedPostCreate);

      obs$.subscribe({
        error: () => {
          this.saving.set(false);
          this.formError.set('admin.posts.errors.save');
        },
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/' + ROUTES.ADMIN_POSTS]);
        },
      });
    } catch {
      this.saving.set(false);
      this.formError.set('admin.posts.errors.upload');
    }
  }

  protected updateCaption(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    const lang = this.activeLang();
    this.captionByLang.update((current) => ({ ...current, [lang]: value }));
  }

  protected updateTitle(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const lang = this.activeLang();
    this.titleByLang.update((current) => ({ ...current, [lang]: value }));
  }
}
