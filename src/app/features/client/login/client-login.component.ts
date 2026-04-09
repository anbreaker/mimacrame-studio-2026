import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { AuthService } from '@core/services/auth.service';
import { toReadableError } from '@core/utils/auth-error.util';
import { LoginFormComponent, LoginSubmitEvent } from '@shared/login-form/login-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginFormComponent, TranslocoDirective],
  selector: 'app-client-login',
  standalone: true,
  styleUrl: './client-login.component.scss',
  templateUrl: './client-login.component.html',
})
export class ClientLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly errorKey = signal<string | null>(null);
  protected readonly isLoading = signal(false);

  private readonly currentUser = toSignal(this.authService.currentUser$);

  protected readonly routes = ROUTES;

  constructor() {
    effect(() => {
      if (this.currentUser()) {
        this.router.navigate(['/' + ROUTES.ACCOUNT]);
      }
    });
  }

  protected async loginWithEmail({ email, password }: LoginSubmitEvent): Promise<void> {
    this.isLoading.set(true);
    this.errorKey.set(null);

    try {
      await firstValueFrom(this.authService.login(email, password));
      this.router.navigate(['/' + ROUTES.ACCOUNT]);
    } catch (error: unknown) {
      this.errorKey.set(toReadableError((error as Error).message));
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async loginWithGoogle(): Promise<void> {
    this.isLoading.set(true);
    this.errorKey.set(null);

    try {
      await firstValueFrom(this.authService.loginWithGoogle());
      this.router.navigate(['/' + ROUTES.ACCOUNT]);
    } catch (error: unknown) {
      this.errorKey.set(toReadableError((error as Error).message));
    } finally {
      this.isLoading.set(false);
    }
  }
}
