import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { AdminNavComponent } from '../../../shared/admin-nav/admin-nav.component';
import { Order } from '../../../core/interfaces/order.interface';
import { Product } from '../../../core/interfaces/product.interface';
import { ORDER_STATUS } from '../../../core/const/order-status.const';
import { ROUTES } from '../../../core/const/routes';
import { signal } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-dashboard',
  imports: [RouterLink, CurrencyPipe, DatePipe, AdminNavComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductService);

  protected readonly routes = ROUTES;
  protected readonly ORDER_STATUS = ORDER_STATUS;

  protected readonly orders = signal<Order[]>([]);
  protected readonly products = signal<Product[]>([]);

  protected readonly pendingCount = computed(
    () => this.orders().filter((o) => o.status === ORDER_STATUS.Pending).length
  );

  protected readonly monthRevenue = computed(() => {
    const now = new Date();
    return this.orders()
      .filter((o) => {
        const date =
          o.createdAt instanceof Date
            ? o.createdAt
            : new Date((o.createdAt as unknown as { seconds: number }).seconds * 1000);
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear() &&
          o.status !== ORDER_STATUS.Cancelled &&
          o.status !== ORDER_STATUS.Refunded
        );
      })
      .reduce((sum, o) => sum + o.total, 0);
  });

  protected readonly monthOrderCount = computed(() => {
    const now = new Date();
    return this.orders().filter((o) => {
      const date =
        o.createdAt instanceof Date
          ? o.createdAt
          : new Date((o.createdAt as unknown as { seconds: number }).seconds * 1000);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
  });

  protected readonly activeProductCount = computed(
    () => this.products().filter((p) => p.active).length
  );

  protected readonly lowStockProducts = computed(() =>
    this.products().filter((p) => p.stock > 0 && p.stock <= 2)
  );

  protected readonly recentOrders = computed(() => this.orders().slice(0, 5));

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
