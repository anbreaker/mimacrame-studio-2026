import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { PRODUCT_CATEGORY, ProductCategory } from '@core/const/product-category.const';
import { ROUTES } from '@core/const/routes';
import { ProductCreate, ProductUpdate } from '@core/interfaces/product.interface';
import { ProductService } from '@core/services/product.service';
import { UploadService } from '@core/services/upload.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

interface ProductFormData {
  active: boolean;
  category: ProductCategory;
  description: string;
  estimatedDays: number;
  images: string[];
  name: string;
  price: number;
}

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

  protected readonly productModel = signal<ProductFormData>({
    active: true,
    category: PRODUCT_CATEGORY.Bracelets,
    description: '',
    estimatedDays: 7,
    images: [],
    name: '',
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
    required(schemaPath.name, { message: 'admin.productForm.basicInfo.fields.name' });
    required(schemaPath.price, { message: 'admin.productForm.basicInfo.fields.price' });
  });

  protected readonly isFormValid = computed(
    () =>
      this.productForm.estimatedDays().valid() &&
      this.productForm.name().valid() &&
      this.productForm.price().valid() &&
      this.productModel().images.length > 0
  );

  private readonly _productData = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((id) =>
        id
          ? this.productService
              .getAll()
              .pipe(map((products) => products.find((p) => p.id === id) ?? null))
          : of(null)
      )
    )
  );

  protected readonly categoryKeys = Object.values(PRODUCT_CATEGORY);
  protected readonly routes = ROUTES;

  constructor() {
    const data = this._productData();
    if (data) {
      this.productModel.set({
        active: data.active,
        category: data.category,
        description: data.description,
        estimatedDays: data.estimatedDays ?? 7,
        images: data.images,
        name: data.name,
        price: data.price,
      });
    }
  }

  protected async onFileChange(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files;
    if (!files?.length) return;

    this.productResponseError.set(null);
    const tempId = this._productId() ?? `temp_${Date.now()}`;

    try {
      const url = await this.uploadService.uploadProductImage(files[0], tempId);
      this.productModel.update((m) => ({ ...m, images: [...m.images, url] }));
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

    const obs$: Observable<string | void> =
      this.isEditMode() && id
        ? this.productService.update(id, data as ProductUpdate)
        : this.productService.create(data as ProductCreate);

    obs$.subscribe({
      error: () => {
        this.saving.set(false);
        this.productResponseError.set('admin.productForm.errors.save');
      },
      next: () => this.router.navigate(['/' + ROUTES.ADMIN_PRODUCTS]),
    });
  }
}
