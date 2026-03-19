import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { Order } from '@core/interfaces/order.interface';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  selector: 'app-account-orders',
  styleUrl: './account-orders.component.scss',
  templateUrl: './account-orders.component.html',
})
export class AccountOrdersComponent {
  // Ready to receive orders from Firestore
  protected readonly orders = signal<Order[]>([]);
}
