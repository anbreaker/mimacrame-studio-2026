import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, ROUTES } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ORDER_STATUS } from '@core/const/order-status.const';
import { Order } from '@core/interfaces/order.interface';
import { Product } from '@core/interfaces/product.interface';
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

  protected readonly orders = signal<Order[]>([]);
  protected readonly products = signal<Product[]>([]);

  protected readonly activeProductCount = computed(
    () => this.products().filter((product) => product.active).length
  );

  protected readonly lowStockProducts = computed(() =>
    this.products().filter((product) => product.stock > 0 && product.stock <= 2)
  );

  protected readonly monthOrderCount = computed(() => {
    const now = new Date();
    return this.orders().filter((order) => {
      const date =
        order.createdAt instanceof Date
          ? order.createdAt
          : new Date((order.createdAt as unknown as { seconds: number }).seconds * 1000);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
  });

  protected readonly monthRevenue = computed(() => {
    const now = new Date();
    return this.orders()
      .filter((order) => {
        const date =
          order.createdAt instanceof Date
            ? order.createdAt
            : new Date((order.createdAt as unknown as { seconds: number }).seconds * 1000);
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
    () => this.orders().filter((order) => order.status === ORDER_STATUS.Pending).length
  );

  protected readonly recentOrders = computed(() => this.orders().slice(0, 5));

  protected readonly ORDER_STATUS = ORDER_STATUS;
  protected readonly routes = ROUTES;

  constructor() {
    this.orderService
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe((orders) => this.orders.set(orders));
    this.productService
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe((products) => this.products.set(products));
  }

  protected toDate(value: unknown): Date {
    return value instanceof Date ? value : new Date((value as { seconds: number }).seconds * 1000);
  }
}
