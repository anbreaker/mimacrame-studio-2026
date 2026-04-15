import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { Material } from '@core/interfaces/material.interface';
import { MaterialService } from '@core/services/material.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, RouterLink, TranslocoDirective],
  selector: 'app-admin-materials-list',
  standalone: true,
  styleUrl: './admin-materials-list.component.scss',
  templateUrl: './admin-materials-list.component.html',
})
export class AdminMaterialsListComponent {
  private readonly materialService = inject(MaterialService);

  protected readonly confirmDeleteId = signal<string | null>(null);
  protected readonly materials = toSignal(this.materialService.getAll(), { initialValue: [] });
  protected readonly isLoading = computed(() => this.materials() === undefined);
  protected readonly routes = ROUTES;

  protected cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  protected async confirmDelete(): Promise<void> {
    const targetId = this.confirmDeleteId();
    if (!targetId) return;

    await firstValueFrom(this.materialService.delete(targetId));
    this.confirmDeleteId.set(null);
  }

  protected async duplicate(material: Material): Promise<void> {
    await firstValueFrom(this.materialService.duplicate(material));
  }

  protected requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }

  protected async toggleAvailable(id: string, current: boolean): Promise<void> {
    await firstValueFrom(this.materialService.update(id, { available: !current }));
  }
}
