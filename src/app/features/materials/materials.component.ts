import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';

import { MATERIAL_CATEGORY } from '@core/interfaces/material.interface';
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

  private readonly _materials = toSignal(this.materialService.getAvailable(), { initialValue: [] });

  protected readonly colors = computed(() =>
    this._materials().filter((material) => material.category === MATERIAL_CATEGORY.Color)
  );

  protected readonly isLoading = computed(() => this._materials() === undefined);

  protected readonly stones = computed(() =>
    this._materials().filter((material) => material.category === MATERIAL_CATEGORY.Stone)
  );

  protected readonly threads = computed(() =>
    this._materials().filter((material) => material.category === MATERIAL_CATEGORY.Thread)
  );

  constructor() {
    this.seoService.update({ titleKey: 'materials.title' });
  }
}
