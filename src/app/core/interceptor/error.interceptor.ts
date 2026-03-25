import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NOTIFICATION_TYPE } from '@core/const/notification-type.const';
import { NotificationService } from '@core/services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  const HTTP_ERROR_HANDLERS: Record<number | string, () => void> = {
    0: () => notificationService.show('errors.network', NOTIFICATION_TYPE.Error),
    401: () => {}, // authInterceptor handles 401 redirects
    403: () => notificationService.show('errors.forbidden', NOTIFICATION_TYPE.Error),
    404: () => notificationService.show('errors.notFound', NOTIFICATION_TYPE.Error),
  };

  const DEFAULT_ERROR_HANDLER = (): void =>
    notificationService.show('errors.server', NOTIFICATION_TYPE.Error);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const handler =
          HTTP_ERROR_HANDLERS[error.status] ?? (error.status >= 500 ? DEFAULT_ERROR_HANDLER : null);

        handler?.();

        if (!import.meta.env['PROD']) {
          console.error('[HTTP Error]', error.status, error.message);
        }
      }

      return throwError(() => error);
    })
  );
};
