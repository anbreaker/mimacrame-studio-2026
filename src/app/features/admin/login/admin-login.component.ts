import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-login',
  template: `<p>Admin — Login</p>`,
})
export class AdminLoginComponent {}
