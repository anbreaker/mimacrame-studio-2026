import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';

const MOCK_DELAY_MS = 800;

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/api/contact')) {
    console.warn('[MockAPI] Intercepted POST /api/contact — returning mock success');

    return of(new HttpResponse({ body: { success: true }, status: 200 })).pipe(
      delay(MOCK_DELAY_MS)
    );
  }

  return next(req);
};
