import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';

import { ROUTES } from '@core/const/routes';
import { AuthService } from '@core/services/auth.service';

export const clientGuard: CanActivateFn = () => {
  const router = inject(Router);

  return inject(AuthService).currentUser$.pipe(
    take(1),
    map((user) => (user !== null ? true : router.createUrlTree(['/' + ROUTES.LOGIN])))
  );
};
