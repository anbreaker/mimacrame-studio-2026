import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { AuthStore } from '@core/store/auth.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslocoDirective],
  selector: 'app-account-shell',
  standalone: true,
  styleUrl: './account-shell.component.scss',
  templateUrl: './account-shell.component.html',
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
