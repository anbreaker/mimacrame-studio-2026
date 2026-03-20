import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { OrderService } from '@core/services/order.service';
import { AuthStore } from '@core/store/auth.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, TranslocoDirective],
  selector: 'app-account-orders',
  standalone: true,
  styleUrl: './account-orders.component.scss',
  templateUrl: './account-orders.component.html',
})
export class AccountOrdersComponent {
  private readonly authStore = inject(AuthStore);
  private readonly orderService = inject(OrderService);

  protected readonly orders = toSignal(
    toObservable(this.authStore.user).pipe(
      switchMap((user) => (user ? this.orderService.getByUser(user.uid) : of([])))
    )
  );
}
