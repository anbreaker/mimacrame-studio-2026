import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { Order } from '@core/interfaces/order.interface';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  selector: 'app-cuenta-pedidos',
  styleUrl: './cuenta-pedidos.component.scss',
  templateUrl: './cuenta-pedidos.component.html',
})
export class CuentaPedidosComponent {
  // Preparado para recibir pedidos de Firestore en el futuro
  protected readonly orders = signal<Order[]>([]);
}
