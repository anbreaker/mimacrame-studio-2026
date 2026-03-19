import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthStore } from '@core/store/auth.store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cuenta-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './cuenta-shell.component.html',
  styleUrl: './cuenta-shell.component.scss',
})
export class CuentaShellComponent {
  protected readonly authStore = inject(AuthStore);

  protected get avatarInitial(): string {
    const name = this.authStore.displayName();
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  protected logout(): void {
    this.authStore.logout();
  }
}
