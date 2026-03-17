import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart',
  template: `<p>Carrito de Compra</p>`,
})
export class CartComponent {}
