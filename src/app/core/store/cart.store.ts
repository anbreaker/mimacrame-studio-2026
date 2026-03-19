import { computed, Injectable, signal } from '@angular/core';

import { CartItem } from '@core/interfaces/cart.interface';
import { Product } from '@core/interfaces/product.interface';

const CART_STORAGE_KEY = 'mimacrame_cart';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _items = signal<CartItem[]>(this.loadFromStorage());

  readonly isEmpty = computed(() => this._items().length === 0);
  readonly itemCount = computed(() =>
    this._items().reduce((total, item) => total + item.quantity, 0)
  );

  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  readonly items = this._items.asReadonly();

  addItem(product: Product, quantity = 1): void {
    const current = this._items();
    const existingIndex = current.findIndex((item) => item.product.id === product.id);

    const updated =
      existingIndex >= 0
        ? current.map((item, index) =>
            index === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...current, { product, quantity }];

    this.persist(updated);
  }

  clear(): void {
    this.persist([]);
  }

  private loadFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private persist(items: CartItem[]): void {
    this._items.set(items);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }

  removeItem(productId: string): void {
    this.persist(this._items().filter((item) => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    const updated =
      quantity <= 0
        ? this._items().filter((item) => item.product.id !== productId)
        : this._items().map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );

    this.persist(updated);
  }
}
