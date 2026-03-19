import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ROUTES } from '@core/const/routes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoDirective],
  selector: 'app-order-confirmation',
  standalone: true,
  styleUrl: './order-confirmation.component.scss',
  templateUrl: './order-confirmation.component.html',
})
export class OrderConfirmationComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  protected readonly isSuccess = signal(true);
  protected readonly orderId = signal<string | null>(null);

  protected readonly routes = ROUTES;

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.orderId.set(params.get('orderId'));
    this.isSuccess.set(params.get('success') === 'true');
  }

  protected get orderRef(): string {
    const id = this.orderId();
    return id ? `#MIM-${id.slice(0, 6).toUpperCase()}` : '#MIM-000000';
  }
}
