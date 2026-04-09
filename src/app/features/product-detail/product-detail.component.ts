import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { LANG } from '@core/const/lang.const';
import { MEDIA_TYPE, MediaType } from '@core/const/media-type.const';
import { ROUTES } from '@core/const/routes';
import { ProductService } from '@core/services/product.service';
import { SeoService } from '@core/services/seo.service';
import { AuthStore } from '@core/store/auth.store';
import { CartStore } from '@core/store/cart.store';

type MediaItem = { type: MediaType; url: string };

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink, TranslocoDirective],
  selector: 'app-product-detail',
  standalone: true,
  styleUrl: './product-detail.component.scss',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {
  private readonly authStore = inject(AuthStore);
  private readonly cartStore = inject(CartStore);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);
  private readonly transloco = inject(TranslocoService);

  protected readonly isLightboxOpen = signal(false);

  protected readonly lightboxImgVisible = signal(true);
  protected readonly quantity = signal(1);
  protected readonly selectedImageIndex = signal(0);
  protected readonly sliderImgVisible = signal(true);
  private readonly _productState = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((id) =>
        id
          ? this.productService
              .getActive()
              .pipe(map((products) => products.find((product) => product.id === id) ?? null))
          : [null]
      )
    )
  );

  protected readonly isLoading = computed(() => this._productState() === undefined);

  protected readonly product = computed(() => this._productState() ?? null);

  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected readonly localizedDescription = computed(() => {
    const lang = this.activeLang();
    const description = this.product()?.description;
    if (!description) return '';
    if (typeof description === 'string') return description;
    return description[lang as keyof typeof description] || description[LANG.Es] || '';
  });

  protected readonly localizedName = computed(() => {
    const lang = this.activeLang();
    const name = this.product()?.name;
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[lang as keyof typeof name] || name[LANG.Es] || '';
  });

  protected readonly MEDIA_TYPE = MEDIA_TYPE;

  protected readonly mediaItems = computed<MediaItem[]>(() => {
    const p = this.product();
    if (!p) return [];
    const videos = (p.videos ?? []).map((url) => ({ type: MEDIA_TYPE.Video, url }));
    const images = p.images.map((url) => ({ type: MEDIA_TYPE.Image, url }));
    return [...videos, ...images];
  });

  protected readonly selectedMedia = computed<MediaItem>(
    () =>
      this.mediaItems()[this.selectedImageIndex()] ?? {
        type: MEDIA_TYPE.Image,
        url: 'assets/images/placeholder-product.jpg',
      }
  );

  private readonly sliderRef = viewChild<ElementRef<HTMLElement>>('slider');

  private touchStartX = 0;

  protected readonly isAdmin = this.authStore.isAdmin;
  protected readonly routes = ROUTES;

  constructor() {
    effect(() => {
      const p = this.product();
      const name = this.localizedName();
      const description = this.localizedDescription();
      if (p) {
        this.seoService.update({
          description,
          image: p.images[0],
          title: name,
        });
      } else if (!this.isLoading()) {
        this.seoService.resetToDefaults();
      }
    });
  }

  protected addToCart(): void {
    const product = this.product();
    product && this.cartStore.addItem(product, this.quantity());
  }

  protected buyNow(): void {
    this.addToCart();
    this.router.navigate(['/' + ROUTES.CHECKOUT]);
  }

  protected closeLightbox(): void {
    this.isLightboxOpen.set(false);
  }

  protected decreaseQuantity(): void {
    this.quantity.update((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  protected increaseQuantity(): void {
    this.quantity.update((currentQuantity) => Math.min(10, currentQuantity + 1));
  }

  protected lightboxNext(): void {
    const items = this.mediaItems();
    if (items.length <= 1) return;
    this.lightboxImgVisible.set(false);
    setTimeout(() => {
      this.selectedImageIndex.update((i) => (i + 1) % items.length);
      this.lightboxImgVisible.set(true);
    }, 160);
  }

  protected lightboxPrev(): void {
    const items = this.mediaItems();
    if (items.length <= 1) return;
    this.lightboxImgVisible.set(false);
    setTimeout(() => {
      this.selectedImageIndex.update((i) => (i - 1 + items.length) % items.length);
      this.lightboxImgVisible.set(true);
    }, 160);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isLightboxOpen()) return;
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowRight') this.lightboxNext();
    if (event.key === 'ArrowLeft') this.lightboxPrev();
  }

  protected onTouchEnd(event: TouchEvent): void {
    const diff = this.touchStartX - event.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? this.sliderNext() : this.sliderPrev();
    }
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  protected openLightbox(index: number): void {
    this.selectedImageIndex.set(index);
    this.isLightboxOpen.set(true);
  }

  protected onFrameClick(event: MouseEvent): void {
    if (this.selectedMedia().type === MEDIA_TYPE.Image) {
      this.openLightbox(this.selectedImageIndex());
    } else {
      const video = (event.currentTarget as HTMLElement).querySelector('video');
      if (video) video.paused ? video.play() : video.pause();
    }
  }

  protected onFrameDblClick(): void {
    if (this.selectedMedia().type === MEDIA_TYPE.Video) {
      this.openLightbox(this.selectedImageIndex());
    }
  }

  protected selectImage(index: number): void {
    if (index === this.selectedImageIndex()) return;
    this.sliderImgVisible.set(false);
    setTimeout(() => {
      this.selectedImageIndex.set(index);
      this.sliderImgVisible.set(true);
    }, 160);
  }

  protected sliderNext(): void {
    const items = this.mediaItems();
    if (items.length <= 1) return;
    this.selectImage((this.selectedImageIndex() + 1) % items.length);
  }

  protected sliderPrev(): void {
    const items = this.mediaItems();
    if (items.length <= 1) return;
    this.selectImage((this.selectedImageIndex() - 1 + items.length) % items.length);
  }
}
