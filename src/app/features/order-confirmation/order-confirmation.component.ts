import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-order-confirmation',
  template: `<p>Pedido Confirmado</p>`,
})
export class OrderConfirmationComponent {}
