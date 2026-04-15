import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { ORDER_STATUS, OrderStatus } from '@core/const/order-status.const';
import { ROUTES } from '@core/const/routes';
import { OrderService } from '@core/services/order.service';
import { OrderMessageService } from '@core/services/order-message.service';
import { AdminNavComponent } from '@shared/admin-nav/admin-nav.component';
import { environment } from '@environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminNavComponent, CurrencyPipe, DatePipe, RouterLink, TranslocoDirective],
  selector: 'app-order-detail',
  standalone: true,
  styleUrl: './order-detail.component.scss',
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent {
  private readonly orderService = inject(OrderService);
  private readonly orderMessageService = inject(OrderMessageService);
  private readonly route = inject(ActivatedRoute);

  protected readonly openStatusDropdown = signal(false);
  protected readonly replyText = signal('');
  protected readonly isSendingReply = signal(false);
  protected readonly replyError = signal(false);

  private readonly _orderId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? ''))
  );

  private readonly _order = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id') ?? ''),
      switchMap((id) => this.orderService.getById(id))
    )
  );

  private readonly _messages = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id') ?? ''),
      switchMap((id) => this.orderMessageService.getMessages(id))
    )
  );

  protected readonly order = computed(() => this._order() ?? null);
  protected readonly isLoading = computed(() => this._order() === undefined);
  protected readonly messages = computed(() => this._messages() ?? []);

  protected readonly orderRef = computed(() => {
    const id = this.order()?.id ?? '';
    return id ? `#${id.slice(0, 6).toUpperCase()}` : '';
  });

  protected readonly routes = ROUTES;
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

  protected toDate(value: unknown): Date {
    return value instanceof Date ? value : new Date((value as { seconds: number }).seconds * 1000);
  }

  protected async selectStatus(orderId: string, status: OrderStatus): Promise<void> {
    this.openStatusDropdown.set(false);
    try {
      await firstValueFrom(this.orderService.updateStatus(orderId, status));
    } catch {
      // status update failed silently
    }
  }

  protected async sendReply(): Promise<void> {
    const order = this.order();
    const content = this.replyText().trim();
    if (!order || !content || this.isSendingReply()) return;

    this.isSendingReply.set(true);
    this.replyError.set(false);

    try {
      await firstValueFrom(this.orderMessageService.sendMessage(order.id, content));

      await fetch('/api/artisan-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': environment.adminSecret,
        },
        body: JSON.stringify({
          customerEmail: order.customerEmail,
          message: content,
          orderRef: this.orderRef(),
        }),
      });

      this.replyText.set('');
    } catch {
      this.replyError.set(true);
    } finally {
      this.isSendingReply.set(false);
    }
  }
}
