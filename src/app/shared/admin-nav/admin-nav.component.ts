import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ROUTES } from '@core/const/routes';
import { AuthStore } from '@core/store/auth.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-admin-nav',
  standalone: true,
  styleUrl: './admin-nav.component.scss',
  templateUrl: './admin-nav.component.html',
})
export class AdminNavComponent {
  protected readonly authStore = inject(AuthStore);

  protected readonly routes = ROUTES;
}
