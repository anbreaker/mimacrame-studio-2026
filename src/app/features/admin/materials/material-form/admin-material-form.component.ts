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

import { ROUTES } from '@core/const/routes';
import { MATERIAL_CATEGORY, MaterialCategory } from '@core/interfaces/material.interface';
import { MaterialService } from '@core/services/material.service';
import { UploadService } from '@core/services/upload.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

interface MaterialFormData {
  available: boolean;
  category: MaterialCategory | null;
  description: string;
  imageUrl: string;
  name: string;
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
  protected readonly uploadService = inject(UploadService);

  protected readonly formData = signal<MaterialFormData>({
    available: true,
    category: null,
    description: '',
    imageUrl: '',
    name: '',
  });

  protected readonly responseError = signal<string | null>(null);

  protected readonly saving = signal(false);

  protected readonly submitAttempted = signal(false);

  private readonly _materialId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id')))
  );

  protected readonly isEditMode = computed(() => !!this._materialId());

  protected readonly isFormValid = computed(() => {
    const { category, imageUrl, name } = this.formData();
    return name.trim() !== '' && category !== null && imageUrl !== '';
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
            description: materialData.description ?? '',
            imageUrl: materialData.imageUrl,
            name: materialData.name,
          });
        });
      }
    });
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

  protected onDescriptionInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.formData.update((data) => ({ ...data, description: value }));
  }

  protected onNameInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formData.update((data) => ({ ...data, name: value }));
  }

  protected async save(): Promise<void> {
    this.submitAttempted.set(true);
    if (!this.isFormValid()) return;

    this.saving.set(true);
    this.responseError.set(null);

    const id = this._materialId();
    const { available, category, description, imageUrl, name } = this.formData();
    if (!category) return;

    const payload = {
      available,
      category,
      imageUrl,
      name: name.trim(),
      ...(description.trim() && { description: description.trim() }),
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

  protected toggleAvailable(): void {
    this.formData.update((data) => ({ ...data, available: !data.available }));
  }
}
