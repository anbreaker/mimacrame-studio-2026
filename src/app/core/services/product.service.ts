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

import { Product, ProductCreate, ProductUpdate } from '../interfaces/product.interface';
import { ProductCategory } from '../const/product-category.const';

const PRODUCTS_COLLECTION = 'products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly firestore = inject(Firestore);

  private get productsRef() {
    return collection(this.firestore, PRODUCTS_COLLECTION);
  }

  getAll(): Observable<Product[]> {
    return collectionData(query(this.productsRef, orderBy('createdAt', 'desc')), {
      idField: 'id',
    }) as Observable<Product[]>;
  }

  getActive(): Observable<Product[]> {
    return collectionData(
      query(this.productsRef, where('active', '==', true), orderBy('createdAt', 'desc')),
      { idField: 'id' }
    ) as Observable<Product[]>;
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

  create(data: ProductCreate): Observable<string> {
    return from(
      addDoc(this.productsRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    ).pipe(map((ref) => ref.id));
  }

  update(id: string, data: ProductUpdate): Observable<void> {
    return from(
      updateDoc(doc(this.firestore, PRODUCTS_COLLECTION, id), {
        ...data,
        updatedAt: serverTimestamp(),
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, PRODUCTS_COLLECTION, id)));
  }
}
