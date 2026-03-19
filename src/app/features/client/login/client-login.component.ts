import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ROUTES } from '@core/const/routes';
import { AuthService } from '@core/services/auth.service';
import { toReadableError } from '@core/utils/auth-error.util';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  selector: 'app-client-login',
  styleUrl: './client-login.component.scss',
  templateUrl: './client-login.component.html',
})
export class ClientLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly currentUser = toSignal(this.authService.currentUser$);

  protected readonly email = signal('');
  protected readonly error = signal<string | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly password = signal('');
  protected readonly showPassword = signal(false);

  constructor() {
    effect(() => {
      if (this.currentUser()) {
        this.router.navigate(['/' + ROUTES.ACCOUNT]);
      }
    });
  }

  protected loginWithEmail(): void {
    const email = this.email().trim();
    const password = this.password();
    if (!email || !password) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/' + ROUTES.ACCOUNT]);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.error.set(toReadableError(err.message));
      },
    });
  }

  protected loginWithGoogle(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.authService.loginWithGoogle().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/' + ROUTES.ACCOUNT]);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.error.set(toReadableError(err.message));
      },
    });
  }
}
