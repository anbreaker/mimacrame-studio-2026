import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';

import { AppUser } from '@core/interfaces/user.interface';
import { AuthService } from '@core/services/auth.service';

import { authGuard } from './auth.guard';

const ROUTE = {} as ActivatedRouteSnapshot;
const STATE = {} as RouterStateSnapshot;

describe('authGuard', () => {
  let userSubject: BehaviorSubject<AppUser | null>;

  const runGuard = (): Promise<boolean | UrlTree> => {
    return TestBed.runInInjectionContext(() =>
      firstValueFrom(authGuard(ROUTE, STATE) as Observable<boolean | UrlTree>)
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

  it('allows access when the user is an admin', async () => {
    userSubject.next({ isAdmin: true, uid: 'admin-1' } as AppUser);

    const result = await runGuard();

    expect(result).toBe(true);
  });

  it('redirects to /admin/login when the user is not an admin', async () => {
    userSubject.next({ isAdmin: false, uid: 'user-1' } as AppUser);

    const result = await runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/admin/login');
  });

  it('redirects to /admin/login when the user is unauthenticated', async () => {
    userSubject.next(null);

    const result = await runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/admin/login');
  });
});
