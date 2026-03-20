import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { email as emailValidator, form, FormField, required } from '@angular/forms/signals';
import { TranslocoDirective } from '@jsverse/transloco';
import { map, of, switchMap } from 'rxjs';

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
  images: string[];
  name: string;
  price: number;
  stock: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, FormField, RouterLink, TranslocoDirective],
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

  protected readonly errorKey = signal<string | null>(null);
  protected readonly isSaving = signal(false);

  private readonly _productId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id')))
  );

  protected readonly isEditMode = computed(() => !!this._productId());

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

  private readonly productModel = signal<ProductFormData>({
    active: true,
    category: PRODUCT_CATEGORY.Bracelets,
    description: '',
    images: [],
    name: '',
    price: 0,
    stock: 0,
  });

  protected readonly productForm = form(this.productModel, (schemaPath) => {
    required(schemaPath.name, { message: 'admin.productForm.basicInfo.fields.name' });
    required(schemaPath.price, { message: 'admin.productForm.basicInfo.fields.price' });
    required(schemaPath.stock, { message: 'admin.productForm.basicInfo.fields.stock' });
  });

  protected readonly isFormValid = computed(
    () =>
      this.productForm.name().valid() &&
      this.productForm.price().valid() &&
      this.productForm.stock().valid() &&
      this.productModel().images.length > 0
  );

  protected readonly categoryKeys = Object.values(PRODUCT_CATEGORY);
  protected readonly routes = ROUTES;

  constructor() {
    // Sync model when product data is loaded in edit mode
    const data = this._productData();
    if (data) {
      this.productModel.set({
        active: data.active,
        category: data.category,
        description: data.description,
        images: data.images,
        name: data.name,
        price: data.price,
        stock: data.stock,
      });
    }
  }

  protected async onFileChange(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files;
    if (!files?.length) return;

    this.errorKey.set(null);
    const tempId = this._productId() ?? `temp_${Date.now()}`;

    try {
      const url = await this.uploadService.uploadProductImage(files[0], tempId);
      this.productModel.update((m) => ({ ...m, images: [...m.images, url] }));
    } catch (error) {
      this.errorKey.set('admin.productForm.errors.upload');
    }
  }

  protected removeImage(index: number): void {
    this.productModel.update((m) => ({
      ...m,
      images: m.images.filter((_, i) => i !== index),
    }));
  }

  protected save(): void {
    if (!this.isFormValid()) return;

    this.isSaving.set(true);
    this.errorKey.set(null);

    const id = this._productId();
    const data = this.productModel();

    const obs$ =
      this.isEditMode() && id
        ? this.productService.update(id, data as ProductUpdate)
        : this.productService.create(data as ProductCreate);

    obs$.subscribe({
      error: () => {
        this.isSaving.set(false);
        this.errorKey.set('admin.productForm.errors.save');
      },
      next: () => this.router.navigate(['/' + ROUTES.ADMIN_PRODUCTS]),
    });
  }
}
