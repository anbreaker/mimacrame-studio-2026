import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
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

  protected readonly isSaving = signal(false);
  protected readonly showSuccess = signal(false);

  // Model Signal para el formulario
  private readonly profileModel = signal<ProfileFormData>({
    city: '',
    country: '',
    fullName: '',
    phone: '',
    postalCode: '',
    province: '',
    street: '',
  });

  // Definición del formulario con validaciones robustas
  protected readonly profileForm = form(this.profileModel, (schemaPath) => {
    required(schemaPath.fullName);
    minLength(schemaPath.fullName, 3);
    
    required(schemaPath.street);
    required(schemaPath.postalCode);
    pattern(schemaPath.postalCode, /^[0-9]{5}$/); // CP español estándar
    
    required(schemaPath.city);
    required(schemaPath.country);
    
    required(schemaPath.phone);
    pattern(schemaPath.phone, /^[0-9]{9,15}$/); // Números de 9 a 15 dígitos
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

  protected readonly avatarInitial = computed(() => {
    const name = this.authStore.displayName();
    return name ? name.charAt(0).toUpperCase() : '?';
  });

  constructor() {
    // Sincronizamos los datos del usuario logueado con el formulario
    effect(() => {
      const user = this.authStore.user();
      if (user) {
        untracked(() => {
          this.profileModel.set({
            city: user.city ?? '',
            country: user.country ?? '',
            fullName: user.displayName ?? '',
            phone: user.phone ?? '',
            postalCode: user.postalCode ?? '',
            province: user.province ?? '',
            street: user.street ?? '',
          });
        });
      }
    });
  }

  protected save(): void {
    const user = this.authStore.user();
    if (!user || !this.isFormValid()) return;

    this.isSaving.set(true);
    this.showSuccess.set(false);

    const data = this.profileModel();
    
    // Mapeamos los datos del formulario a las propiedades de AppUser
    const updateData: Partial<AppUser> = {
      city: data.city,
      country: data.country,
      displayName: data.fullName,
      phone: data.phone,
      postalCode: data.postalCode,
      province: data.province,
      street: data.street,
    };

    this.authService.updateProfile(user.uid, updateData).subscribe({
      complete: () => {
        this.isSaving.set(false);
        this.showSuccess.set(true);
        setTimeout(() => this.showSuccess.set(false), 3000);
      },
      error: () => this.isSaving.set(false),
    });
  }
}
