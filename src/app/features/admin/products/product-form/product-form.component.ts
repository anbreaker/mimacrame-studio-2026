import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { PRODUCT_CATEGORY, ProductCategory } from '@core/const/product-category.const';
import { ROUTES } from '@core/const/routes';
import { Product } from '@core/interfaces/product.interface';
import { ProductService } from '@core/services/product.service';
import { UploadService } from '@core/services/upload.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [PRODUCT_CATEGORY.Anklets]: 'Tobilleras',
  [PRODUCT_CATEGORY.Bracelets]: 'Pulseras',
  [PRODUCT_CATEGORY.Earrings]: 'Pendientes',
  [PRODUCT_CATEGORY.Pendants]: 'Colgantes',
  [PRODUCT_CATEGORY.Rings]: 'Anillos',
  [PRODUCT_CATEGORY.Sets]: 'Conjuntos',
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, FormsModule, RouterLink],
  selector: 'app-product-form',
  standalone: true,
  styleUrl: './product-form.component.scss',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly uploadService = inject(UploadService);

  protected readonly active = signal(true);
  protected readonly category = signal<ProductCategory>(PRODUCT_CATEGORY.Bracelets);
  protected readonly description = signal('');
  protected readonly error = signal<string | null>(null);
  protected readonly images = signal<string[]>([]);
  protected readonly isEditMode = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly isUploading = signal(false);
  protected readonly name = signal('');
  protected readonly price = signal(0);
  protected readonly productId = signal<string | null>(null);
  protected readonly stock = signal(0);

  protected readonly isValid = computed(
    () => this.name().trim().length > 0 && this.price() > 0 && this.stock() >= 0
  );

  protected readonly categoryKeys = Object.values(PRODUCT_CATEGORY);
  protected readonly categoryLabels = CATEGORY_LABELS;
  protected readonly PRODUCT_CATEGORY = PRODUCT_CATEGORY;
  protected readonly routes = ROUTES;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    id && this.loadProduct(id);
  }

  private fillForm(product: Product): void {
    this.name.set(product.name);
    this.description.set(product.description);
    this.price.set(product.price);
    this.stock.set(product.stock);
    this.category.set(product.category);
    this.active.set(product.active);
    this.images.set(product.images);
  }

  private loadProduct(id: string): void {
    this.isEditMode.set(true);
    this.productId.set(id);

    this.productService
      .getAll()
      .pipe(
        map((products) => products.find((product) => product.id === id) ?? null),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((product) =>
        product ? this.fillForm(product) : this.router.navigate(['/' + ROUTES.ADMIN_PRODUCTS])
      );
  }

  protected onFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files?.length) return;

    this.isUploading.set(true);
    const tempId = this.productId() ?? `temp_${Date.now()}`;

    this.uploadService.uploadProductImage(files[0], tempId).subscribe({
      error: () => {
        this.error.set('upload.error.generic');
        this.isUploading.set(false);
      },
      next: (url) => {
        this.images.update((imgs) => [...imgs, url]);
        this.isUploading.set(false);
      },
    });
  }

  protected removeImage(index: number): void {
    this.images.update((images) => images.filter((_url, idx) => idx !== index));
  }

  protected save(): void {
    if (!this.isValid()) return;
    this.isSaving.set(true);
    this.error.set(null);

    const data = {
      active: this.active(),
      category: this.category(),
      description: this.description().trim(),
      images: this.images(),
      name: this.name().trim(),
      price: this.price(),
      stock: this.stock(),
    };

    const id = this.productId();
    const operation$ =
      this.isEditMode() && id
        ? this.productService.update(id, data)
        : this.productService.create(data).pipe(map(() => void 0));

    operation$.subscribe({
      error: () => {
        this.isSaving.set(false);
        this.error.set('product.save.error');
      },
      next: () => this.router.navigate(['/' + ROUTES.ADMIN_PRODUCTS]),
    });
  }
}
