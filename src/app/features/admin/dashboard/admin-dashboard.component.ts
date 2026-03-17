import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-dashboard',
  template: `<p>Admin — Dashboard</p>`,
})
export class AdminDashboardComponent {}
