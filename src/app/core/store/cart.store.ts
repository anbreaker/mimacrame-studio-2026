import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';

import { STORAGE_KEYS } from '@core/const/storage-keys.const';
import { CartItem } from '@core/interfaces/cart.interface';
import { Product } from '@core/interfaces/product.interface';
import { AuthStore } from '@core/store/auth.store';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly authStore = inject(AuthStore);
  private readonly _items = signal<CartItem[]>([]);

  readonly isEmpty = computed(() => this._items().length === 0);
  readonly itemCount = computed(() =>
    this._items().reduce((total, item) => total + item.quantity, 0)
  );

  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  readonly items = this._items.asReadonly();

  constructor() {
    // Reload cart whenever the authenticated user changes (including logout → login as different user)
    effect(() => {
      const uid = this.authStore.user()?.uid ?? null;

      untracked(() => this._items.set(this._loadFromStorage(this._storageKey(uid))));
    });
  }

  private _currentKey(): string {
    return this._storageKey(this.authStore.user()?.uid ?? null);
  }

  private _loadFromStorage(key: string): CartItem[] {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private _persist(items: CartItem[]): void {
    this._items.set(items);
    localStorage.setItem(this._currentKey(), JSON.stringify(items));
  }

  private _storageKey(uid: string | null): string {
    return uid ? `${STORAGE_KEYS.Cart}_${uid}` : `${STORAGE_KEYS.Cart}_anonymous`;
  }

  addItem(product: Product, quantity = 1): void {
    const current = this._items();
    const existingIndex = current.findIndex((item) => item.product.id === product.id);

    const updated =
      existingIndex >= 0
        ? current.map((item, index) =>
            index === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...current, { product, quantity }];

    this._persist(updated);
  }

  clear(): void {
    this._persist([]);
  }

  removeItem(productId: string): void {
    this._persist(this._items().filter((item) => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    const updated =
      quantity <= 0
        ? this._items().filter((item) => item.product.id !== productId)
        : this._items().map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );

    this._persist(updated);
  }
}
