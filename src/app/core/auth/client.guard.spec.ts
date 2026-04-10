import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';

import { ROUTES } from '@core/const/routes';
import { AppUser } from '@core/interfaces/user.interface';
import { AuthService } from '@core/services/auth.service';

import { clientGuard } from './client.guard';

const ROUTE = {} as ActivatedRouteSnapshot;
const STATE = {} as RouterStateSnapshot;

describe('clientGuard', () => {
  let userSubject: BehaviorSubject<AppUser | null>;

  const runGuard = (): Promise<boolean | UrlTree> => {
    return TestBed.runInInjectionContext(() =>
      firstValueFrom(clientGuard(ROUTE, STATE) as Observable<boolean | UrlTree>)
    );
  };

  beforeEach(() => {
    userSubject = new BehaviorSubject<AppUser | null>(null);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { currentUser$: userSubject.asObservable() } },
      ],
    });
  });

  it('redirects unauthenticated users to /login', async () => {
    userSubject.next(null);

    const result = await runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe(`/${ROUTES.LOGIN}`);
  });

  it('redirects admin users to /admin', async () => {
    userSubject.next({ isAdmin: true, uid: 'admin-1' } as AppUser);

    const result = await runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe(`/${ROUTES.ADMIN}`);
  });

  it('allows access for regular authenticated users', async () => {
    userSubject.next({ isAdmin: false, uid: 'user-1' } as AppUser);

    const result = await runGuard();

    expect(result).toBe(true);
  });
});
