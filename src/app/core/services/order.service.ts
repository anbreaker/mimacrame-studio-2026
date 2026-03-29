import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

import { COLLECTIONS } from '@core/const/collections.const';
import { OrderStatus } from '@core/const/order-status.const';
import { Order, OrderCreate } from '@core/interfaces/order.interface';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);

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
    return runInInjectionContext(
      this.injector,
      () =>
        collectionData(query(this.ordersRef, orderBy('createdAt', 'desc')), {
          idField: 'id',
        }) as Observable<Order[]>
    );
  }

  getById(orderId: string): Observable<Order | null> {
    return runInInjectionContext(
      this.injector,
      () =>
        docData(doc(this.firestore, COLLECTIONS.Orders, orderId), {
          idField: 'id',
        }) as Observable<Order | null>
    );
  }

  getByUser(userId: string): Observable<Order[]> {
    return runInInjectionContext(
      this.injector,
      () =>
        collectionData(query(this.ordersRef, where('userId', '==', userId)), {
          idField: 'id',
        }) as Observable<Order[]>
    ).pipe(
      map((orders) =>
        [...orders].sort((orderA, orderB) => {
          const toSeconds = (order: Order): number =>
            (order.createdAt as unknown as { seconds: number })?.seconds ?? 0;
          return toSeconds(orderB) - toSeconds(orderA);
        })
      )
    );
  }

  private get ordersRef(): ReturnType<typeof collection> {
    return collection(this.firestore, COLLECTIONS.Orders);
  }

  updateStatus(orderId: string, status: OrderStatus): Observable<void> {
    return from(
      updateDoc(doc(this.firestore, COLLECTIONS.Orders, orderId), {
        status,
        updatedAt: serverTimestamp(),
      })
    );
  }
}
