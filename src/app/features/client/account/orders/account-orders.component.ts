import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { ORDER_STATUS, OrderStatus } from '@core/const/order-status.const';
import { OrderService } from '@core/services/order.service';
import { AuthStore } from '@core/store/auth.store';
import { LocalizePipe } from '@shared/pipes/localize.pipe';

const HAPPY_PATH_STATUSES: OrderStatus[] = [
  ORDER_STATUS.Pending,
  ORDER_STATUS.Paid,
  ORDER_STATUS.Processing,
  ORDER_STATUS.Shipped,
  ORDER_STATUS.Delivered,
];

const STATUS_EMOJI: Record<OrderStatus, string> = {
  cancelled: '❌',
  delivered: '🏡',
  paid: '💳',
  pending: '⏳',
  processing: '🧵',
  refunded: '💸',
  shipped: '📦',
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, LocalizePipe, TranslocoDirective],
  selector: 'app-account-orders',
  standalone: true,
  styleUrl: './account-orders.component.scss',
  templateUrl: './account-orders.component.html',
})
export class AccountOrdersComponent {
  private readonly authStore = inject(AuthStore);
  private readonly orderService = inject(OrderService);

  protected readonly expandedOrderId = signal<string | null>(null);

  protected readonly HAPPY_PATH_STATUSES = HAPPY_PATH_STATUSES;

  protected readonly orders = toSignal(
    toObservable(this.authStore.user).pipe(
      switchMap((user) =>
        user ? this.orderService.getByUser(user.uid).pipe(catchError(() => of([]))) : of([])
      )
    )
  );

  protected readonly STATUS_EMOJI = STATUS_EMOJI;

  protected isTerminal(status: OrderStatus): boolean {
    return status === ORDER_STATUS.Cancelled || status === ORDER_STATUS.Refunded;
  }

  protected orderRef(orderId: string): string {
    return `#MIM-${orderId.slice(0, 6).toUpperCase()}`;
  }

  protected stepState(step: OrderStatus, currentStatus: OrderStatus): 'done' | 'active' | 'future' {
    const currentIndex = HAPPY_PATH_STATUSES.indexOf(currentStatus);
    const stepIndex = HAPPY_PATH_STATUSES.indexOf(step);
    if (stepIndex < currentIndex) return 'done';
    if (stepIndex === currentIndex) return 'active';
    return 'future';
  }

  protected toDate(value: unknown): Date {
    return value instanceof Date ? value : new Date((value as { seconds: number }).seconds * 1000);
  }

  protected toggleExpand(orderId: string): void {
    this.expandedOrderId.update((id) => (id === orderId ? null : orderId));
  }
}
