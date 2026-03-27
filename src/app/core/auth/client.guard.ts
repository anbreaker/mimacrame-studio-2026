import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';

import { ROUTES } from '@core/const/routes';
import { AuthService } from '@core/services/auth.service';

export const clientGuard: CanActivateFn = () => {
  const router = inject(Router);

  return inject(AuthService).currentUser$.pipe(
    take(1),
    map((user) => {
      if (user === null) return router.createUrlTree(['/' + ROUTES.LOGIN]);
      if (user.isAdmin === true) return router.createUrlTree(['/' + ROUTES.ADMIN]);
      return true;
    })
  );
};
