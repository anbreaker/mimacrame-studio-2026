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
import { form, FormField, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, map, Observable, of, switchMap, take } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { AVAILABLE_LANGS, LANG, Lang } from '@core/const/lang.const';
import { PRODUCT_CATEGORY, ProductCategory } from '@core/const/product-category.const';
import { ROUTES } from '@core/const/routes';
import { LocalizedString, ProductCreate, ProductUpdate } from '@core/interfaces/product.interface';
import { ProductService } from '@core/services/product.service';
import { UploadService } from '@core/services/upload.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

interface ProductFormData {
  active: boolean;
  category: ProductCategory;
  estimatedDays: number;
  images: string[];
  price: number;
}

const EMPTY_LOCALIZED: LocalizedString = { en: '', es: '', pt: '' };

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, DecimalPipe, FormField, RouterLink, TranslocoDirective],
  selector: 'app-product-form',
  standalone: true,
  styleUrl: './product-form.component.scss',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly uploadService = inject(UploadService);

  protected readonly activeLang = signal<Lang>(LANG.Es);

  protected readonly descriptionByLang = signal<LocalizedString>({ ...EMPTY_LOCALIZED });
  protected readonly nameByLang = signal<LocalizedString>({ ...EMPTY_LOCALIZED });
  protected readonly productModel = signal<ProductFormData>({
    active: true,
    category: PRODUCT_CATEGORY.Bracelets,
    estimatedDays: 7,
    images: [],
    price: 0,
  });

  protected readonly productResponseError = signal<string | null>(null);
  protected readonly saving = signal(false);

  private readonly _productId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id')))
  );

  protected readonly isEditMode = computed(() => !!this._productId());

  protected readonly productForm = form(this.productModel, (schemaPath) => {
    required(schemaPath.estimatedDays, {
      message: 'admin.productForm.basicInfo.fields.estimatedDays',
    });
    required(schemaPath.price, { message: 'admin.productForm.basicInfo.fields.price' });
  });

  protected readonly isFormValid = computed(() => {
    const name = this.nameByLang();
    const description = this.descriptionByLang();
    const allNamesFilledIn =
      name.es.trim() !== '' && name.en.trim() !== '' && name.pt.trim() !== '';
    const allDescriptionsFilledIn =
      description.es.trim() !== '' && description.en.trim() !== '' && description.pt.trim() !== '';

    return (
      allNamesFilledIn &&
      allDescriptionsFilledIn &&
      this.productForm.estimatedDays().valid() &&
      this.productForm.price().valid() &&
      this.productModel().images.length > 0
    );
  });

  private readonly _productData = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((id) =>
        id
          ? this.productService.getAll().pipe(
              map((products) => products.find((product) => product.id === id) ?? null),
              filter((product) => product !== null),
              take(1)
            )
          : of(null)
      )
    )
  );

  protected readonly availableLangs = AVAILABLE_LANGS;
  protected readonly categoryKeys = Object.values(PRODUCT_CATEGORY);
  protected readonly routes = ROUTES;

  constructor() {
    effect(() => {
      const data = this._productData();
      if (data) {
        untracked(() => {
          this.productModel.set({
            active: data.active,
            category: data.category,
            estimatedDays: data.estimatedDays ?? 7,
            images: data.images,
            price: data.price,
          });
          this.nameByLang.set(
            typeof data.name === 'string'
              ? { en: data.name, es: data.name, pt: data.name }
              : { ...EMPTY_LOCALIZED, ...data.name }
          );
          this.descriptionByLang.set(
            typeof data.description === 'string'
              ? { en: data.description, es: data.description, pt: data.description }
              : { ...EMPTY_LOCALIZED, ...data.description }
          );
        });
      }
    });
  }

  protected async onFileChange(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files;
    if (!files?.length) return;

    this.productResponseError.set(null);
    const tempId = this._productId() ?? `temp_${Date.now()}`;

    try {
      const url = await this.uploadService.uploadProductImage(files[0], tempId);
      this.productModel.update((model) => ({ ...model, images: [...model.images, url] }));
    } catch (error) {
      this.productResponseError.set('admin.productForm.errors.upload');
      console.error(error);
    }
  }

  protected removeImage(index: number): void {
    this.productModel.update((product) => ({
      ...product,
      images: product.images.filter((_unusedImage, imageIndex) => imageIndex !== index),
    }));
  }

  protected save(): void {
    if (!this.isFormValid()) return;

    this.saving.set(true);
    this.productResponseError.set(null);

    const id = this._productId();
    const data = this.productModel();
    const payload: ProductCreate = {
      ...data,
      description: this.descriptionByLang(),
      name: this.nameByLang(),
    };

    const obs$: Observable<string | void> =
      this.isEditMode() && id
        ? this.productService.update(id, payload as ProductUpdate)
        : this.productService.create(payload);

    obs$.subscribe({
      error: () => {
        this.saving.set(false);
        this.productResponseError.set('admin.productForm.errors.save');
      },
      next: () => this.router.navigate(['/' + ROUTES.ADMIN_PRODUCTS]),
    });
  }

  protected updateDescription(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    const lang = this.activeLang();
    this.descriptionByLang.update((current) => ({ ...current, [lang]: value }));
  }

  protected updateName(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const lang = this.activeLang();
    this.nameByLang.update((current) => ({ ...current, [lang]: value }));
  }
}
