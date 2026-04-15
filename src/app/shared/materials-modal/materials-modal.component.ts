import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';

import { MATERIAL_CATEGORY } from '@core/interfaces/material.interface';
import { MaterialService } from '@core/services/material.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  selector: 'app-materials-modal',
  standalone: true,
  styleUrl: './materials-modal.component.scss',
  templateUrl: './materials-modal.component.html',
})
export class MaterialsModalComponent {
  private readonly materialService = inject(MaterialService);

  private readonly _materials = toSignal(this.materialService.getAvailable(), { initialValue: [] });

  protected readonly colors = computed(() =>
    this._materials().filter((material) => material.category === MATERIAL_CATEGORY.Color)
  );

  protected readonly stones = computed(() =>
    this._materials().filter((material) => material.category === MATERIAL_CATEGORY.Stone)
  );

  protected readonly threads = computed(() =>
    this._materials().filter((material) => material.category === MATERIAL_CATEGORY.Thread)
  );

  protected readonly isEmpty = computed(
    () => this.stones().length === 0 && this.threads().length === 0 && this.colors().length === 0
  );

  readonly closed = output<void>();

  protected close(): void {
    this.closed.emit();
  }
}
