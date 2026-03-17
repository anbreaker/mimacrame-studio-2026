import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checkout',
  template: `<p>Checkout</p>`,
})
export class CheckoutComponent {}
