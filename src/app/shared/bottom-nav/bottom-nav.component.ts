import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';
import { CartStore } from '@core/store/cart.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, TranslocoDirective],
  selector: 'app-bottom-nav',
  standalone: true,
  styleUrl: './bottom-nav.component.scss',
  templateUrl: './bottom-nav.component.html',
})
export class BottomNavComponent {
  protected readonly cartStore = inject(CartStore);

  protected readonly routes = ROUTES;
}
