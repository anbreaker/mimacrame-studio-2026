import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { email as emailValidator, form, FormField, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { AuthService } from '@core/services/auth.service';
import { toReadableError } from '@core/utils/auth-error.util';

interface RegisterFormData {
  displayName: string;
  email: string;
  password: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, RouterLink, TranslocoDirective],
  selector: 'app-client-register',
  standalone: true,
  styleUrl: './client-register.component.scss',
  templateUrl: './client-register.component.html',
})
export class ClientRegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly errorKey = signal<string | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly registerModel = signal<RegisterFormData>({
    displayName: '',
    email: '',
    password: '',
  });

  protected readonly showPassword = signal(false);

  protected readonly registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.displayName, { message: 'account.profile.nameLabel' });
    required(schemaPath.email, { message: 'shared.loginForm.errors.emailRequired' });
    emailValidator(schemaPath.email, { message: 'shared.loginForm.errors.emailInvalid' });
    required(schemaPath.password, { message: 'shared.loginForm.errors.passwordRequired' });
  });

  protected readonly isFormValid = computed(
    () =>
      this.registerForm.displayName().valid() &&
      this.registerForm.email().valid() &&
      this.registerForm.password().valid()
  );

  protected readonly routes = ROUTES;

  protected register(): void {
    if (!this.isFormValid()) {
      this.registerForm.displayName().markAsTouched();
      this.registerForm.email().markAsTouched();
      this.registerForm.password().markAsTouched();
      return;
    }

    const { displayName, email, password } = this.registerModel();
    this.isLoading.set(true);
    this.errorKey.set(null);

    this.authService.register(email, password, displayName).subscribe({
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
