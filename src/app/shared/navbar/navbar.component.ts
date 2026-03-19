import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { AuthStore } from '@core/store/auth.store';
import { CartStore } from '@core/store/cart.store';
import { LangSelectorComponent } from '@shared/lang-selector/lang-selector.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, LangSelectorComponent, TranslocoDirective],
  selector: 'app-navbar',
  standalone: true,
  styleUrl: './navbar.component.scss',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  protected readonly authStore = inject(AuthStore);
  protected readonly cartStore = inject(CartStore);

  protected readonly routes = ROUTES;
}
