import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { AuthService } from '@core/services/auth.service';
import { toReadableError } from '@core/utils/auth-error.util';
import { LoginFormComponent, LoginSubmitEvent } from '@shared/login-form/login-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginFormComponent, RouterLink, TranslocoDirective],
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

  protected loginWithEmail({ email, password }: LoginSubmitEvent): void {
    this.isLoading.set(true);
    this.errorKey.set(null);

    this.authService.login(email, password).subscribe({
      error: (error: Error) => {
        this.isLoading.set(false);
        this.errorKey.set(toReadableError(error.message));
      },
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/' + ROUTES.ACCOUNT]);
      },
    });
  }

  protected loginWithGoogle(): void {
    this.isLoading.set(true);
    this.errorKey.set(null);

    this.authService.loginWithGoogle().subscribe({
      error: (error: Error) => {
        this.isLoading.set(false);
        this.errorKey.set(toReadableError(error.message));
      },
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/' + ROUTES.ACCOUNT]);
      },
    });
  }
}
