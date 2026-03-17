import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-orders',
  template: `<p>Admin — Pedidos</p>`,
})
export class AdminOrdersComponent {}
