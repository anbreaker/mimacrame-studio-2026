import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { MATERIAL_CATEGORY } from '@core/interfaces/material.interface';
import { LocalizedString } from '@core/interfaces/product.interface';
import { MaterialService } from '@core/services/material.service';
import { SeoService } from '@core/services/seo.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  selector: 'app-materials',
  standalone: true,
  styleUrl: './materials.component.scss',
  templateUrl: './materials.component.html',
})
export class MaterialsComponent {
  private readonly materialService = inject(MaterialService);
  private readonly seoService = inject(SeoService);
  private readonly transloco = inject(TranslocoService);

  protected readonly lightboxAlt = signal<string>('');

  protected readonly lightboxUrl = signal<string | null>(null);

  protected readonly lightboxVisible = signal(false);

  private readonly _materials = toSignal(this.materialService.getAvailable());

  protected readonly colors = computed(() =>
    (this._materials() ?? []).filter((material) => material.category === MATERIAL_CATEGORY.Color)
  );

  protected readonly isLoading = computed(() => this._materials() === undefined);

  protected readonly stones = computed(() =>
    (this._materials() ?? []).filter((material) => material.category === MATERIAL_CATEGORY.Stone)
  );

  protected readonly threads = computed(() =>
    (this._materials() ?? []).filter((material) => material.category === MATERIAL_CATEGORY.Thread)
  );

  protected readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  constructor() {
    this.seoService.update({ titleKey: 'materials.title' });
  }

  protected closeLightbox(): void {
    this.lightboxUrl.set(null);
  }

  protected localize(value: LocalizedString | string | undefined, lang: string): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang as keyof LocalizedString] ?? value.es ?? '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeLightbox();
  }

  protected openLightbox(url: string, alt: string): void {
    this.lightboxUrl.set(url);
    this.lightboxAlt.set(alt);
    this.lightboxVisible.set(false);
    requestAnimationFrame(() => this.lightboxVisible.set(true));
  }
}
