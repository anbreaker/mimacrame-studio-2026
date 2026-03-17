import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-form',
  template: `<p>Admin — Formulario de Producto</p>`,
})
export class ProductFormComponent {}
