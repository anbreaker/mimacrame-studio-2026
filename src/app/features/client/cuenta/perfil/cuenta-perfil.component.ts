import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AuthStore } from '@core/store/auth.store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cuenta-perfil',
  imports: [DatePipe],
  templateUrl: './cuenta-perfil.component.html',
  styleUrl: './cuenta-perfil.component.scss',
})
export class CuentaPerfilComponent {
  protected readonly authStore = inject(AuthStore);

  protected get avatarInitial(): string {
    const name = this.authStore.displayName();
    return name ? name.charAt(0).toUpperCase() : '?';
  }
}
