import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

import { COLLECTIONS } from '@core/const/collections.const';
import {
  ContactMessage,
  ContactMessageCreate,
  ContactRequest,
  ContactResponse,
} from '@core/interfaces/contact.interface';

const API_BASE = '/api';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly firestore = inject(Firestore);
  private readonly http = inject(HttpClient);
  private readonly injector = inject(Injector);

  getByUser(userId: string): Observable<ContactMessage[]> {
    return runInInjectionContext(
      this.injector,
      () =>
        collectionData(
          query(this.messagesRef, where('sentByUid', '==', userId), orderBy('createdAt', 'desc')),
          { idField: 'id' }
        ) as Observable<ContactMessage[]>
    );
  }

  private get messagesRef(): ReturnType<typeof collection> {
    return collection(this.firestore, COLLECTIONS.ContactMessages);
  }

  saveMessage(data: ContactMessageCreate): Observable<string> {
    return from(
      runInInjectionContext(this.injector, () =>
        addDoc(this.messagesRef, {
          ...data,
          createdAt: serverTimestamp(),
        })
      )
    ).pipe(map((ref) => ref.id));
  }

  send(payload: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${API_BASE}/contact`, payload);
  }
}
