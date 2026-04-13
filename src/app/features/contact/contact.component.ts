import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  email as emailValidator,
  form,
  FormField,
  maxLength,
  minLength,
  required,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { ContactService } from '@core/services/contact.service';
import { SeoService } from '@core/services/seo.service';
import { AuthStore } from '@core/store/auth.store';

interface ContactFormData {
  email: string;
  honeypot: string;
  message: string;
  name: string;
  subject: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, TranslocoDirective],
  selector: 'app-contact',
  standalone: true,
  styleUrl: './contact.component.scss',
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private readonly authStore = inject(AuthStore);
  private readonly contactService = inject(ContactService);
  private readonly seoService = inject(SeoService);
  private readonly transloco = inject(TranslocoService);

  private readonly formModel = signal<ContactFormData>({
    email: '',
    honeypot: '',
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

  constructor() {
    this.seoService.update({ titleKey: 'contact.title' });

    const user = this.authStore.user();
    if (user) {
      this.formModel.set({
        email: user.email ?? '',
        honeypot: '',
        message: '',
        name: user.displayName ?? '',
        subject: '',
      });
    }
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
          honeypot: data.honeypot,
          lang: this.activeLang() as 'es' | 'en' | 'pt',
          message: data.message,
          name: data.name,
          sentByUid: user?.uid,
          subject: data.subject,
        })
      );

      this.isSuccess.set(true);
    } catch {
      this.hasError.set(true);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
