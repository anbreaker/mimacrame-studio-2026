import { inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { NOTIFICATION_TYPE, NotificationType } from '@core/const/notification-type.const';

export interface AppNotification {
  id: string;
  message: string;
  type: NotificationType;
}

export { NOTIFICATION_TYPE };

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly transloco = inject(TranslocoService);

  readonly notifications = signal<AppNotification[]>([]);

  dismiss(id: string): void {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }

  show(messageKey: string, type: NotificationType = NOTIFICATION_TYPE.Info): void {
    const message = this.transloco.translate(messageKey);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.notifications.update((list) => [...list, { id, message, type }]);

    setTimeout(() => this.dismiss(id), 5000);
  }
}
