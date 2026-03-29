import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';

import { ORDER_STATUS, OrderStatus } from '@core/const/order-status.const';
import { Order } from '@core/interfaces/order.interface';
import { OrderService } from '@core/services/order.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

const FILTER_ALL = 'all' as const;
type FilterStatus = OrderStatus | typeof FILTER_ALL;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, CurrencyPipe, DatePipe, TranslocoDirective],
  selector: 'app-admin-orders',
  standalone: true,
  styleUrl: './admin-orders.component.scss',
  templateUrl: './admin-orders.component.html',
})
export class AdminOrdersComponent {
  private readonly orderService = inject(OrderService);

  protected readonly expandedOrderId = signal<string | null>(null);
  protected readonly openStatusDropdownId = signal<string | null>(null);
  protected readonly filterStatus = signal<FilterStatus>(FILTER_ALL);
  protected readonly isLoading = signal(true);
  protected readonly orders = signal<Order[]>([]);

  protected readonly filteredOrders = computed(() => {
    const filter = this.filterStatus();
    return filter === FILTER_ALL
      ? this.orders()
      : this.orders().filter((order) => order.status === filter);
  });

  protected readonly FILTER_ALL = FILTER_ALL;
  protected readonly ORDER_STATUS = ORDER_STATUS;
  protected readonly statusKeys = Object.values(ORDER_STATUS);
  protected readonly statusEmoji: Record<OrderStatus, string> = {
    cancelled: '❌',
    delivered: '🏡',
    paid: '💳',
    pending: '⏳',
    processing: '🧵',
    refunded: '💸',
    shipped: '📦',
  };

  constructor() {
    this.orderService
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe((orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      });
  }

  protected toDate(value: unknown): Date {
    return value instanceof Date ? value : new Date((value as { seconds: number }).seconds * 1000);
  }

  protected toggleExpand(orderId: string): void {
    this.expandedOrderId.update((id) => (id === orderId ? null : orderId));
  }

  protected selectStatus(orderId: string, status: OrderStatus): void {
    this.openStatusDropdownId.set(null);
    this.orderService.updateStatus(orderId, status).subscribe();
  }
}
