import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ORDER_STATUS } from '@core/const/order-status.const';
import { ROUTES } from '@core/const/routes';
import { OrderService } from '@core/services/order.service';
import { ProductService } from '@core/services/product.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, CurrencyPipe, DatePipe, RouterLink, TranslocoDirective],
  selector: 'app-admin-dashboard',
  standalone: true,
  styleUrl: './admin-dashboard.component.scss',
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductService);

  private readonly _orders = toSignal(this.orderService.getAll(), { initialValue: [] });
  private readonly _products = toSignal(this.productService.getAll(), { initialValue: [] });

  protected readonly activeProductCount = computed(
    () => this._products().filter((product) => product.active).length
  );

  protected readonly lowStockProducts = computed(() =>
    this._products().filter((product) => product.stock > 0 && product.stock <= 2)
  );

  protected readonly monthOrderCount = computed(() => {
    const now = new Date();
    return this._orders().filter((order) => {
      const date = this.toDate(order.createdAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
  });

  protected readonly monthRevenue = computed(() => {
    const now = new Date();
    return this._orders()
      .filter((order) => {
        const date = this.toDate(order.createdAt);
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear() &&
          order.status !== ORDER_STATUS.Cancelled &&
          order.status !== ORDER_STATUS.Refunded
        );
      })
      .reduce((sum, order) => sum + order.total, 0);
  });

  protected readonly pendingCount = computed(
    () => this._orders().filter((order) => order.status === ORDER_STATUS.Pending).length
  );

  protected readonly recentOrders = computed(() => this._orders().slice(0, 5));

  protected readonly ORDER_STATUS = ORDER_STATUS;
  protected readonly routes = ROUTES;

  protected toDate(value: unknown): Date {
    if (value instanceof Date) return value;
    if (typeof value === 'string') return new Date(value);
    if (value && typeof value === 'object' && 'seconds' in value) {
      return new Date((value as { seconds: number }).seconds * 1000);
    }
    return new Date();
  }
}
