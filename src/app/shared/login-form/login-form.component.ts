import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { email as emailValidator, form, FormField, required } from '@angular/forms/signals';
import { TranslocoDirective } from '@jsverse/transloco';

export interface LoginSubmitEvent {
  email: string;
  password: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, TranslocoDirective],
  selector: 'app-login-form',
  standalone: true,
  styleUrl: './login-form.component.scss',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  private readonly loginModel = signal<LoginFormData>({ email: '', password: '' });
  protected readonly showPassword = signal(false);
  protected readonly loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'errors.emailRequired' });
    emailValidator(schemaPath.email, { message: 'errors.emailInvalid' });
    required(schemaPath.password, { message: 'errors.passwordRequired' });
  });

  protected readonly isFormValid = computed(
    () => this.loginForm.email().valid() && this.loginForm.password().valid()
  );

  readonly emailPlaceholder = input('');
  readonly error = input<string | null>(null);

  readonly isLoading = input(false);

  readonly subtitle = input.required<string>();

  readonly emailSubmit = output<LoginSubmitEvent>();

  readonly googleSubmit = output<void>();

  protected submit(): void {
    const { email, password } = this.loginModel();
    this.emailSubmit.emit({ email: email.trim(), password });
  }
}
