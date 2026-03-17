import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-products-list',
  template: `<p>Admin — Lista de Productos</p>`,
})
export class ProductsListComponent {}
