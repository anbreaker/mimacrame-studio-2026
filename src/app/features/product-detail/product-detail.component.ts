import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-detail',
  template: `<p>Detalle de Producto</p>`,
})
export class ProductDetailComponent {}
