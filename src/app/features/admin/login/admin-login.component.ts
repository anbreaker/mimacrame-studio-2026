import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthStore } from '@core/store/auth.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  selector: 'app-admin-login',
  standalone: true,
  styleUrl: './admin-login.component.scss',
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  protected readonly authStore = inject(AuthStore);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly showPassword = signal(false);

  protected submit(): void {
    const email = this.email().trim();
    const password = this.password();
    email && password && this.authStore.login(email, password);
  }
}
