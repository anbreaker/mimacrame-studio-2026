import { inject, Injectable } from '@angular/core';
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
import { ProductCategory } from '@core/const/product-category.const';
import { Product, ProductCreate, ProductUpdate } from '@core/interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly firestore = inject(Firestore);

  create(data: ProductCreate): Observable<string> {
    return from(
      addDoc(this.productsRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    ).pipe(map((ref) => ref.id));
  }

  delete(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, COLLECTIONS.Products, id)));
  }

  getActive(): Observable<Product[]> {
    return collectionData(
      query(this.productsRef, where('active', '==', true), orderBy('createdAt', 'desc')),
      { idField: 'id' }
    ) as Observable<Product[]>;
  }

  getAll(): Observable<Product[]> {
    return collectionData(query(this.productsRef, orderBy('createdAt', 'desc')), {
      idField: 'id',
    }) as Observable<Product[]>;
  }

  getByCategory(category: ProductCategory): Observable<Product[]> {
    return collectionData(
      query(
        this.productsRef,
        where('category', '==', category),
        where('active', '==', true),
        orderBy('createdAt', 'desc')
      ),
      { idField: 'id' }
    ) as Observable<Product[]>;
  }

  private get productsRef(): ReturnType<typeof collection> {
    return collection(this.firestore, COLLECTIONS.Products);
  }

  update(id: string, data: ProductUpdate): Observable<void> {
    return from(
      updateDoc(doc(this.firestore, COLLECTIONS.Products, id), {
        ...data,
        updatedAt: serverTimestamp(),
      })
    );
  }
}
