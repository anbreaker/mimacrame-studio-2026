import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoDirective],
  selector: 'app-not-found',
  standalone: true,
  styleUrl: './not-found.component.scss',
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  protected readonly routes = ROUTES;
}
