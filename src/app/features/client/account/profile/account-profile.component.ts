import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AuthStore } from '@core/store/auth.store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-account-profile',
  imports: [DatePipe],
  templateUrl: './account-profile.component.html',
  styleUrl: './account-profile.component.scss',
})
export class AccountProfileComponent {
  protected readonly authStore = inject(AuthStore);

  protected get avatarInitial(): string {
    const name = this.authStore.displayName();
    return name ? name.charAt(0).toUpperCase() : '?';
  }
}
