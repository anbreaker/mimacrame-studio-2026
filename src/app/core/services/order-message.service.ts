import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

import { COLLECTIONS } from '@core/const/collections.const';
import { OrderMessage } from '@core/interfaces/order-message.interface';

@Injectable({ providedIn: 'root' })
export class OrderMessageService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);

  getMessages(orderId: string): Observable<OrderMessage[]> {
    return runInInjectionContext(this.injector, () => {
      const messagesRef = collection(this.firestore, COLLECTIONS.Orders, orderId, 'messages');
      return collectionData(query(messagesRef, orderBy('createdAt', 'asc')), {
        idField: 'id',
      }) as Observable<OrderMessage[]>;
    });
  }

  sendMessage(orderId: string, content: string): Observable<string> {
    const messagesRef = collection(this.firestore, COLLECTIONS.Orders, orderId, 'messages');
    return from(
      addDoc(messagesRef, {
        content,
        createdAt: serverTimestamp(),
        from: 'artisan',
        read: false,
      })
    ).pipe(map((ref) => ref.id));
  }
}
