import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { Order } from '@core/interfaces/order.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DecimalPipe, TranslocoDirective],
  selector: 'app-account-orders',
  standalone: true,
  styleUrl: './account-orders.component.scss',
  templateUrl: './account-orders.component.html',
})
export class AccountOrdersComponent {
  // Ready to receive orders from Firestore
  protected readonly orders = signal<Order[]>([]);
}
