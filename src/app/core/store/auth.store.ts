import { computed, inject, Injectable, signal } from '@angular/core';
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

  private readonly _error = signal<string | null>(initialState.error);
  private readonly _isLoading = signal(initialState.isLoading);
  private readonly _user = signal<AppUser | null>(initialState.user);

  readonly displayName = computed(() => this._user()?.displayName ?? this._user()?.email ?? null);
  readonly isAdmin = computed(() => this._user()?.isAdmin ?? false);
  readonly isLoggedIn = computed(() => this._user() !== null);

  readonly error = this._error.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly user = this._user.asReadonly();

  constructor() {
    this.authService.currentUser$.pipe(takeUntilDestroyed()).subscribe((user) => {
      this._user.set(user);
      this._isLoading.set(false);
    });
  }

  clearError(): void {
    this._error.set(null);
  }

  login(email: string, password: string): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.authService.login(email, password).subscribe({
      error: (err: Error) => {
        this._isLoading.set(false);
        this._error.set(toReadableError(err.message));
      },
      next: () => {
        this._isLoading.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
    });
  }

  loginWithGoogle(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.authService.loginWithGoogle().subscribe({
      error: (err: Error) => {
        this._isLoading.set(false);
        this._error.set(toReadableError(err.message));
      },
      next: () => {
        this._isLoading.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
    });
  }
}
