import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { ORDER_STATUS, OrderStatus } from '@core/const/order-status.const';
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
  protected readonly filterStatus = signal<FilterStatus>(FILTER_ALL);
  protected readonly openStatusDropdownId = signal<string | null>(null);

  private readonly _orders = toSignal(this.orderService.getAll());
  protected readonly orders = computed(() => this._orders() ?? []);
  protected readonly filteredOrders = computed(() => {
    const filter = this.filterStatus();
    return filter === FILTER_ALL
      ? this.orders()
      : this.orders().filter((order) => order.status === filter);
  });

  protected readonly isLoading = computed(() => this._orders() === undefined);

  protected readonly FILTER_ALL = FILTER_ALL;
  protected readonly ORDER_STATUS = ORDER_STATUS;
  protected readonly statusEmoji: Record<OrderStatus, string> = {
    cancelled: '❌',
    delivered: '🏡',
    paid: '💳',
    pending: '⏳',
    processing: '🧵',
    refunded: '💸',
    shipped: '📦',
  };

  protected readonly statusKeys = Object.values(ORDER_STATUS);

  protected async selectStatus(orderId: string, status: OrderStatus): Promise<void> {
    this.openStatusDropdownId.set(null);
    try {
      await firstValueFrom(this.orderService.updateStatus(orderId, status));
    } catch {
      // status update failed silently
    }
  }

  protected toDate(value: unknown): Date {
    return value instanceof Date ? value : new Date((value as { seconds: number }).seconds * 1000);
  }

  protected toggleExpand(orderId: string): void {
    this.expandedOrderId.update((id) => (id === orderId ? null : orderId));
  }
}
