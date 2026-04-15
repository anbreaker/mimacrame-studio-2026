import { DecimalPipe } from '@angular/common';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, firstValueFrom, map, Observable, of, switchMap, take } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { AVAILABLE_LANGS, LANG, Lang } from '@core/const/lang.const';
import { ROUTES } from '@core/const/routes';
import { MATERIAL_CATEGORY, MaterialCategory } from '@core/interfaces/material.interface';
import { LocalizedString } from '@core/interfaces/product.interface';
import { MaterialService } from '@core/services/material.service';
import { TranslationService } from '@core/services/translation.service';
import { UploadService } from '@core/services/upload.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

const EMPTY_LOCALIZED: LocalizedString = { en: '', es: '', pt: '' };

interface MaterialFormData {
  available: boolean;
  category: MaterialCategory | null;
  imageUrl: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, DecimalPipe, RouterLink, TranslocoDirective],
  selector: 'app-admin-material-form',
  standalone: true,
  styleUrl: './admin-material-form.component.scss',
  templateUrl: './admin-material-form.component.html',
})
export class AdminMaterialFormComponent {
  private readonly materialService = inject(MaterialService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly translationService = inject(TranslationService);
  protected readonly uploadService = inject(UploadService);

  protected readonly activeLang = signal<Lang>(LANG.Es);
  protected readonly descriptionByLang = signal<LocalizedString>({ ...EMPTY_LOCALIZED });

  protected readonly formData = signal<MaterialFormData>({
    available: true,
    category: null,
    imageUrl: '',
  });

  protected readonly nameByLang = signal<LocalizedString>({ ...EMPTY_LOCALIZED });

  protected readonly responseError = signal<string | null>(null);

  protected readonly saving = signal(false);
  protected readonly submitAttempted = signal(false);
  protected readonly translateError = signal<string | null>(null);
  private readonly _materialId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id')))
  );

  protected readonly isEditMode = computed(() => !!this._materialId());

  protected readonly isFormValid = computed(() => {
    const { category, imageUrl } = this.formData();

    const name = this.nameByLang();
    const description = this.descriptionByLang();

    const allNamesFilledIn =
      name.es.trim() !== '' && name.en.trim() !== '' && name.pt.trim() !== '';
    const allDescriptionsFilledIn =
      description.es.trim() !== '' && description.en.trim() !== '' && description.pt.trim() !== '';

    return allNamesFilledIn && allDescriptionsFilledIn && category !== null && imageUrl !== '';
  });

  private readonly _materialData = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((id) =>
        id
          ? this.materialService.getAll().pipe(
              map((materials) => materials.find((material) => material.id === id) ?? null),
              filter((material) => material !== null),
              take(1)
            )
          : of(null)
      )
    )
  );

  protected readonly availableLangs = AVAILABLE_LANGS;

  protected readonly categories = Object.values(MATERIAL_CATEGORY);
  protected readonly routes = ROUTES;

  constructor() {
    effect(() => {
      const materialData = this._materialData();
      if (materialData) {
        untracked(() => {
          this.formData.set({
            available: materialData.available,
            category: materialData.category,
            imageUrl: materialData.imageUrl,
          });

          const name = materialData.name;
          this.nameByLang.set(
            typeof name === 'string'
              ? { ...EMPTY_LOCALIZED, es: name as string }
              : { ...EMPTY_LOCALIZED, ...name }
          );

          const desc = materialData.description;
          if (desc) {
            this.descriptionByLang.set(
              typeof desc === 'string'
                ? { ...EMPTY_LOCALIZED, es: desc as string }
                : { ...EMPTY_LOCALIZED, ...desc }
            );
          }
        });
      }
    });
  }

  protected async autoTranslate(): Promise<void> {
    const name = this.nameByLang()[LANG.Es];
    const description = this.descriptionByLang()[LANG.Es];
    if (!name.trim()) return;

    this.translateError.set(null);
    try {
      const result = await this.translationService.translateAll(name, description);
      this.nameByLang.update((c) => ({ ...c, en: result.nameEn, pt: result.namePt }));
      this.descriptionByLang.update((c) => ({ ...c, en: result.descEn, pt: result.descPt }));
    } catch {
      this.translateError.set('admin.materialForm.errors.translate');
    }
  }

  protected onDescriptionInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    const lang = this.activeLang();
    this.descriptionByLang.update((c) => ({ ...c, [lang]: value }));
  }

  protected async onFileChange(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files;
    if (!files?.length) return;

    this.responseError.set(null);
    const materialId = this._materialId() ?? `temp_${Date.now()}`;

    try {
      const url = await this.uploadService.uploadMaterialImage(files[0], materialId);
      this.formData.update((data) => ({ ...data, imageUrl: url }));
    } catch {
      this.responseError.set('admin.materialForm.errors.upload');
    }
  }

  protected onNameInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const lang = this.activeLang();
    this.nameByLang.update((c) => ({ ...c, [lang]: value }));
  }

  protected async save(): Promise<void> {
    this.submitAttempted.set(true);
    if (!this.isFormValid()) {
      document.querySelector('.material-form__response-error')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    this.saving.set(true);
    this.responseError.set(null);

    const id = this._materialId();
    const { available, category, imageUrl } = this.formData();
    if (!category) return;

    const name = this.nameByLang();
    const description = this.descriptionByLang();
    const hasDescription = Object.values(description).some((v) => v.trim() !== '');

    const payload = {
      available,
      category,
      imageUrl,
      name,
      ...(hasDescription && { description }),
    };

    const save$: Observable<string | void> =
      this.isEditMode() && id
        ? this.materialService.update(id, payload)
        : this.materialService.create(payload);

    try {
      await firstValueFrom(save$);
      this.router.navigate(['/' + ROUTES.ADMIN_MATERIALS]);
    } catch {
      this.saving.set(false);
      this.responseError.set('admin.materialForm.errors.save');
    }
  }

  protected selectCategory(category: MaterialCategory): void {
    this.formData.update((data) => ({ ...data, category }));
  }

  protected setAvailable(value: boolean): void {
    this.formData.update((data) => ({ ...data, available: value }));
  }
}
