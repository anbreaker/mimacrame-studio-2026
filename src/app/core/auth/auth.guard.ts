import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';

import { AuthService } from '@core/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  return inject(AuthService).currentUser$.pipe(
    take(1),
    map((user) => (user?.isAdmin === true ? true : router.createUrlTree(['/admin/login'])))
  );
};
