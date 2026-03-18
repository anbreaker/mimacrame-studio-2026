import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

import { Order, OrderCreate } from '../interfaces/order.interface';
import { OrderStatus } from '../const/order-status.const';

const ORDERS_COLLECTION = 'orders';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly firestore = inject(Firestore);

  private get ordersRef() {
    return collection(this.firestore, ORDERS_COLLECTION);
  }

  create(data: OrderCreate): Observable<string> {
    return from(
      addDoc(this.ordersRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    ).pipe(map((ref) => ref.id));
  }

  getAll(): Observable<Order[]> {
    return collectionData(query(this.ordersRef, orderBy('createdAt', 'desc')), {
      idField: 'id',
    }) as Observable<Order[]>;
  }

  getByUser(userId: string): Observable<Order[]> {
    return collectionData(
      query(this.ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc')),
      { idField: 'id' }
    ) as Observable<Order[]>;
  }

  updateStatus(orderId: string, status: OrderStatus): Observable<void> {
    return from(
      updateDoc(doc(this.firestore, ORDERS_COLLECTION, orderId), {
        status,
        updatedAt: serverTimestamp(),
      })
    );
  }
}
