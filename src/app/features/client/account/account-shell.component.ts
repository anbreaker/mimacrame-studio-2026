import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthStore } from '@core/store/auth.store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-account-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './account-shell.component.html',
  styleUrl: './account-shell.component.scss',
})
export class AccountShellComponent {
  protected readonly authStore = inject(AuthStore);

  protected get avatarInitial(): string {
    const name = this.authStore.displayName();
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  protected logout(): void {
    this.authStore.logout();
  }
}
