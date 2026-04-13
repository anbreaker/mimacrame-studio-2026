import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  email as emailValidator,
  form,
  FormField,
  maxLength,
  minLength,
  required,
} from '@angular/forms/signals';
import { catchError, of, switchMap } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { ContactService } from '@core/services/contact.service';
import { AuthStore } from '@core/store/auth.store';

interface AccountContactFormData {
  email: string;
  message: string;
  name: string;
  subject: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, FormField, TranslocoDirective],
  selector: 'app-account-contact',
  standalone: true,
  styleUrl: './account-contact.component.scss',
  templateUrl: './account-contact.component.html',
})
export class AccountContactComponent {
  private readonly authStore = inject(AuthStore);
  private readonly contactService = inject(ContactService);
  private readonly transloco = inject(TranslocoService);

  private readonly formModel = signal<AccountContactFormData>({
    email: '',
    message: '',
    name: '',
    subject: '',
  });

  protected readonly hasError = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly isSuccess = signal(false);

  protected readonly contactForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.name);
    minLength(schemaPath.name, 2);
    required(schemaPath.email);
    emailValidator(schemaPath.email);
    required(schemaPath.subject);
    minLength(schemaPath.subject, 3);
    required(schemaPath.message);
    minLength(schemaPath.message, 10);
    maxLength(schemaPath.message, 2000);
  });

  protected readonly isFormValid = computed(
    () =>
      this.contactForm.name().valid() &&
      this.contactForm.email().valid() &&
      this.contactForm.subject().valid() &&
      this.contactForm.message().valid()
  );

  protected readonly canSubmit = computed(() => this.isFormValid() && !this.isSubmitting());

  protected readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected readonly messages = toSignal(
    toObservable(this.authStore.user).pipe(
      switchMap((user) =>
        user ? this.contactService.getByUser(user.uid).pipe(catchError(() => of([]))) : of([])
      )
    )
  );

  constructor() {
    const user = this.authStore.user();
    this.formModel.set({
      email: user?.email ?? '',
      message: '',
      name: user?.displayName ?? '',
      subject: '',
    });
  }

  protected async submit(): Promise<void> {
    if (!this.canSubmit()) return;

    this.isSubmitting.set(true);
    this.hasError.set(false);

    const data = this.formModel();
    const user = this.authStore.user();

    try {
      await firstValueFrom(
        this.contactService.send({
          email: data.email,
          honeypot: '',
          lang: this.activeLang() as 'es' | 'en' | 'pt',
          message: data.message,
          name: data.name,
          sentByUid: user?.uid,
          subject: data.subject,
        })
      );

      if (user) {
        await firstValueFrom(
          this.contactService.saveMessage({
            email: data.email,
            lang: this.activeLang() as 'es' | 'en' | 'pt',
            message: data.message,
            name: data.name,
            sentByUid: user.uid,
            subject: data.subject,
          })
        );
      }

      this.isSuccess.set(true);
      this.formModel.set({
        email: user?.email ?? '',
        message: '',
        name: user?.displayName ?? '',
        subject: '',
      });
    } catch {
      this.hasError.set(true);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected toDate(value: unknown): Date {
    return value instanceof Date ? value : new Date((value as { seconds: number }).seconds * 1000);
  }
}
