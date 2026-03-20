import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { AppUser } from '@core/interfaces/user.interface';
import { AuthService } from '@core/services/auth.service';
import { toReadableError } from '@core/utils/auth-error.util';

interface AuthState {
  error: string | null;
  isLoading: boolean;
  user: AppUser | null;
}

const initialState: AuthState = {
  error: null,
  isLoading: true,
  user: null,
};

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly _errorKey = signal<string | null>(initialState.error);
  private readonly _isCheckingAdmin = signal(false);
  private readonly _isLoading = signal(initialState.isLoading);
  private readonly _user = signal<AppUser | null>(initialState.user);

  readonly displayName = computed(() => this._user()?.displayName ?? this._user()?.email ?? null);
  readonly isAdmin = computed(() => this._user()?.isAdmin ?? false);
  readonly isLoggedIn = computed(() => this._user() !== null);

  readonly errorKey = this._errorKey.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly user = this._user.asReadonly();

  constructor() {
    this.authService.currentUser$.pipe(takeUntilDestroyed()).subscribe((user) => {
      this._user.set(user);
      this._isLoading.set(false);
    });

    effect(() => {
      const user = this.user();
      const isChecking = this._isCheckingAdmin();

      if (isChecking && user) {
        untracked(() => {
          this._isCheckingAdmin.set(false);

          if (user.isAdmin) {
            this._isLoading.set(false);
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.authService.logout().subscribe(() => {
              this._isLoading.set(false);
              this._errorKey.set('authErrors.noAdmin');
            });
          }
        });
      }
    });
  }

  clearError(): void {
    this._errorKey.set(null);
  }

  login(email: string, password: string): void {
    this._isLoading.set(true);
    this._errorKey.set(null);
    this._isCheckingAdmin.set(true);

    this.authService.login(email, password).subscribe({
      error: (error: Error) => {
        this._isLoading.set(false);
        this._isCheckingAdmin.set(false);
        this._errorKey.set(toReadableError(error.message));
      },
    });
  }

  loginWithGoogle(): void {
    this._isLoading.set(true);
    this._errorKey.set(null);
    this._isCheckingAdmin.set(true);

    this.authService.loginWithGoogle().subscribe({
      error: (error: Error) => {
        this._isLoading.set(false);
        this._isCheckingAdmin.set(false);
        this._errorKey.set(toReadableError(error.message));
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
    });
  }
}
