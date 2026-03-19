import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthStore } from '@core/store/auth.store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
})
export class AdminLoginComponent {
  protected readonly authStore = inject(AuthStore);

  protected readonly email = signal('');
  protected readonly password = signal('');

  protected submit(): void {
    const email = this.email().trim();
    const password = this.password();
    email && password && this.authStore.login(email, password);
  }
}
