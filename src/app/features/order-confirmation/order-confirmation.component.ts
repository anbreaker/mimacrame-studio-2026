import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { ORDER_STATUS } from '@core/const/order-status.const';
import { ROUTES } from '@core/const/routes';
import { Order } from '@core/interfaces/order.interface';
import { OrderService } from '@core/services/order.service';
import { LocalizePipe } from '@shared/pipes/localize.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, LocalizePipe, RouterLink, TranslocoDirective],
  selector: 'app-order-confirmation',
  standalone: true,
  styleUrl: './order-confirmation.component.scss',
  templateUrl: './order-confirmation.component.html',
})
export class OrderConfirmationComponent {
  private readonly orderService = inject(OrderService);
  private readonly transloco = inject(TranslocoService);

  protected readonly isSuccess = signal(false);

  protected readonly orderId = signal<string | null>(null);
  protected readonly order = toSignal(
    toObservable(this.orderId).pipe(
      switchMap((id) => (id ? this.orderService.getById(id) : of(null)))
    )
  );

  protected readonly orderLoading = computed(() => this.order() === undefined);

  protected readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected readonly ORDER_STATUS = ORDER_STATUS;

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
