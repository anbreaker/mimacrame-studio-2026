import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { TranslocoDirective } from '@jsverse/transloco';

import { AppUser } from '@core/interfaces/user.interface';
import { AuthService } from '@core/services/auth.service';
import { AuthStore } from '@core/store/auth.store';

interface ProfileFormData {
  city: string;
  country: string;
  fullName: string;
  phone: string;
  postalCode: string;
  province: string;
  street: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, TranslocoDirective],
  selector: 'app-account-profile',
  standalone: true,
  styleUrl: './account-profile.component.scss',
  templateUrl: './account-profile.component.html',
})
export class AccountProfileComponent {
  private readonly authService = inject(AuthService);
  protected readonly authStore = inject(AuthStore);

  private readonly profileModel = signal<ProfileFormData>({
    city: '',
    country: '',
    fullName: '',
    phone: '',
    postalCode: '',
    province: '',
    street: '',
  });

  protected readonly saving = signal(false);
  protected readonly showSuccess = signal(false);

  protected readonly avatarInitial = computed(() => {
    const name = this.authStore.displayName();
    return name ? name.charAt(0).toUpperCase() : '?';
  });

  protected readonly profileForm = form(this.profileModel, (schemaPath) => {
    required(schemaPath.fullName);
    minLength(schemaPath.fullName, 3);

    required(schemaPath.street);
    required(schemaPath.postalCode);
    pattern(schemaPath.postalCode, /^[0-9]{5}$/);

    required(schemaPath.city);
    required(schemaPath.country);

    required(schemaPath.phone);
    pattern(schemaPath.phone, /^[0-9]{9,15}$/);
  });

  protected readonly isFormValid = computed(
    () =>
      this.profileForm.fullName().valid() &&
      this.profileForm.street().valid() &&
      this.profileForm.postalCode().valid() &&
      this.profileForm.city().valid() &&
      this.profileForm.country().valid() &&
      this.profileForm.phone().valid()
  );

  constructor() {
    effect(() => {
      const user = this.authStore.user();
      if (user) {
        untracked(() => {
          this.profileModel.set({
            city: user.address?.city ?? '',
            country: user.address?.country ?? '',
            fullName: user.displayName ?? '',
            phone: user.address?.phone ?? '',
            postalCode: user.address?.postalCode ?? '',
            province: user.address?.province ?? '',
            street: user.address?.street ?? '',
          });
        });
      }
    });
  }

  protected save(): void {
    const user = this.authStore.user();
    if (!user || !this.isFormValid()) return;

    this.saving.set(true);
    this.showSuccess.set(false);

    const data = this.profileModel();

    const updateData: Partial<AppUser> = {
      address: {
        city: data.city,
        country: data.country,
        fullName: data.fullName,
        phone: data.phone,
        postalCode: data.postalCode,
        province: data.province,
        street: data.street,
      },
      displayName: data.fullName,
    };

    this.authService.updateProfile(user.uid, updateData).subscribe({
      complete: () => {
        this.saving.set(false);
        this.showSuccess.set(true);
        setTimeout(() => this.showSuccess.set(false), 3000);
      },
      error: () => this.saving.set(false),
    });
  }
}
