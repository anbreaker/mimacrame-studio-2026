import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { AuthStore } from '@core/store/auth.store';
import { LoginFormComponent, LoginSubmitEvent } from '@shared/login-form/login-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginFormComponent, TranslocoDirective],
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  protected readonly authStore = inject(AuthStore);

  protected login({ email, password }: LoginSubmitEvent): void {
    this.authStore.login(email, password);
  }
}
