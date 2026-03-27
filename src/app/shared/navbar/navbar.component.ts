import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { AuthStore } from '@core/store/auth.store';
import { CartStore } from '@core/store/cart.store';
import { LangSelectorComponent } from '@shared/lang-selector/lang-selector.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LangSelectorComponent, RouterLink, RouterLinkActive, TranslocoDirective],
  selector: 'app-navbar',
  standalone: true,
  styleUrl: './navbar.component.scss',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private readonly router = inject(Router);

  protected readonly authStore = inject(AuthStore);
  protected readonly cartStore = inject(CartStore);

  protected readonly isAdminRoute = toSignal(
    this.router.events.pipe(
      filter((navigationEvent) => navigationEvent instanceof NavigationEnd),
      map((navigationEvent) =>
        (navigationEvent as NavigationEnd).urlAfterRedirects.startsWith('/admin')
      )
    ),
    { initialValue: this.router.url.startsWith('/admin') }
  );

  protected readonly routes = ROUTES;
}
