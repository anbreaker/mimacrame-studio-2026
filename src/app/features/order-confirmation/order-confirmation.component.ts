import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { Order } from '@core/interfaces/order.interface';
import { OrderService } from '@core/services/order.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink, TranslocoDirective],
  selector: 'app-order-confirmation',
  standalone: true,
  styleUrl: './order-confirmation.component.scss',
  templateUrl: './order-confirmation.component.html',
})
export class OrderConfirmationComponent {
  private readonly orderService = inject(OrderService);

  protected readonly isSuccess = signal(false);
  protected readonly orderId = signal<string | null>(null);

  protected readonly order = toSignal(
    toObservable(this.orderId).pipe(
      switchMap((id) => (id ? this.orderService.getById(id) : of(null)))
    )
  );

  protected readonly routes = ROUTES;

  constructor() {
    const params = inject(ActivatedRoute).snapshot.queryParamMap;
    this.orderId.set(params.get('orderId'));
    this.isSuccess.set(params.get('success') === 'true');
  }

  protected orderRef(order: Order): string {
    return `#MIM-${order.id.slice(0, 6).toUpperCase()}`;
  }
}
