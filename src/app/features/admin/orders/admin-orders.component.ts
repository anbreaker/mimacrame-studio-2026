import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ORDER_STATUS, OrderStatus } from '@core/const/order-status.const';
import { Order } from '@core/interfaces/order.interface';
import { OrderService } from '@core/services/order.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [ORDER_STATUS.Pending]: 'Pendiente',
  [ORDER_STATUS.Paid]: 'Pagado',
  [ORDER_STATUS.Processing]: 'Preparando',
  [ORDER_STATUS.Shipped]: 'Enviado',
  [ORDER_STATUS.Delivered]: 'Entregado',
  [ORDER_STATUS.Cancelled]: 'Cancelado',
  [ORDER_STATUS.Refunded]: 'Reembolsado',
};

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, CurrencyPipe, DatePipe],
  selector: 'app-admin-orders',
  styleUrl: './admin-orders.component.scss',
  templateUrl: './admin-orders.component.html',
})
export class AdminOrdersComponent {
  private readonly orderService = inject(OrderService);

  protected readonly expandedOrderId = signal<string | null>(null);
  protected readonly filterStatus = signal<OrderStatus | 'all'>('all');
  protected readonly isLoading = signal(true);
  protected readonly orders = signal<Order[]>([]);

  protected readonly ORDER_STATUS = ORDER_STATUS;
  protected readonly statusLabels = ORDER_STATUS_LABELS;
  protected readonly statusKeys = Object.values(ORDER_STATUS);

  protected readonly filteredOrders = computed(() => {
    const filter = this.filterStatus();
    return filter === 'all' ? this.orders() : this.orders().filter((o) => o.status === filter);
  });

  constructor() {
    this.orderService
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe((orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      });
  }

  protected toggleExpand(orderId: string): void {
    this.expandedOrderId.update((id) => (id === orderId ? null : orderId));
  }

  protected updateStatus(orderId: string, status: OrderStatus): void {
    this.orderService.updateStatus(orderId, status).subscribe();
  }

  protected toDate(value: unknown): Date {
    return value instanceof Date ? value : new Date((value as { seconds: number }).seconds * 1000);
  }
}
