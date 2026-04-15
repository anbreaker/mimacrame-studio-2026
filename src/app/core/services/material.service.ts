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
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

import { COLLECTIONS } from '@core/const/collections.const';
import { Material, MaterialCreate } from '@core/interfaces/material.interface';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);

  create(data: MaterialCreate): Observable<string> {
    return from(addDoc(this.materialsRef, data)).pipe(map((ref) => ref.id));
  }

  delete(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, COLLECTIONS.Materials, id)));
  }

  duplicate(material: Material): Observable<string> {
    const { ...data } = material;
    return this.create(data);
  }

  getAll(): Observable<Material[]> {
    return runInInjectionContext(
      this.injector,
      () =>
        collectionData(query(this.materialsRef, orderBy('category')), {
          idField: 'id',
        }) as Observable<Material[]>
    );
  }

  getAvailable(): Observable<Material[]> {
    return runInInjectionContext(
      this.injector,
      () =>
        collectionData(query(this.materialsRef, where('available', '==', true)), {
          idField: 'id',
        }) as Observable<Material[]>
    );
  }

  private get materialsRef(): ReturnType<typeof collection> {
    return collection(this.firestore, COLLECTIONS.Materials);
  }

  update(id: string, data: Partial<MaterialCreate>): Observable<void> {
    return from(updateDoc(doc(this.firestore, COLLECTIONS.Materials, id), data));
  }
}
