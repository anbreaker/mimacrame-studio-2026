import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

import { COLLECTIONS } from '@core/const/collections.const';
import {
  CuratedPost,
  CuratedPostCreate,
  CuratedPostSection,
  CuratedPostUpdate,
} from '@core/interfaces/curated-post.interface';

@Injectable({ providedIn: 'root' })
export class CuratedPostsService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);

  getActive(section: CuratedPostSection): Observable<CuratedPost[]> {
    return runInInjectionContext(
      this.injector,
      () =>
        collectionData(
          query(
            this.collectionRef,
            where('section', '==', section),
            where('active', '==', true),
            orderBy('order', 'asc')
          ),
          { idField: 'id' }
        ) as Observable<CuratedPost[]>
    );
  }

  getAll(): Observable<CuratedPost[]> {
    return runInInjectionContext(
      this.injector,
      () =>
        collectionData(query(this.collectionRef, orderBy('order', 'asc')), {
          idField: 'id',
        }) as Observable<CuratedPost[]>
    );
  }

  create(data: CuratedPostCreate): Observable<string> {
    return from(
      addDoc(this.collectionRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    ).pipe(map((ref) => ref.id));
  }

  update(id: string, data: CuratedPostUpdate): Observable<void> {
    return from(
      updateDoc(doc(this.firestore, COLLECTIONS.CuratedPosts, id), {
        ...data,
        updatedAt: serverTimestamp(),
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, COLLECTIONS.CuratedPosts, id)));
  }

  private get collectionRef(): ReturnType<typeof collection> {
    return collection(this.firestore, COLLECTIONS.CuratedPosts);
  }
}
