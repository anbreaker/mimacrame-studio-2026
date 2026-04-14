import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { STORAGE_KEYS } from '@core/const/storage-keys.const';
import { CartItem } from '@core/interfaces/cart.interface';
import { Product } from '@core/interfaces/product.interface';
import { AppUser } from '@core/interfaces/user.interface';
import { AuthStore } from '@core/store/auth.store';
import { CartStore } from '@core/store/cart.store';

const ANON_KEY = `${STORAGE_KEYS.Cart}_anonymous`;
const USER_KEY = `${STORAGE_KEYS.Cart}_user-123`;

function makeProduct(id: string, price: number): Product {
  return {
    active: true,
    category: 'necklaces',
    createdAt: new Date(),
    description: { en: 'Desc', es: 'Desc', pt: 'Desc' },
    estimatedDays: 7,
    id,
    images: [],
    name: { en: 'Name', es: 'Nombre', pt: 'Nome' },
    price,
    updatedAt: new Date(),
  };
}

describe('CartStore', () => {
  let store: CartStore;
  let userSignal: ReturnType<typeof signal<AppUser | null>>;

  beforeEach(() => {
    localStorage.clear();
    userSignal = signal<AppUser | null>(null);

    TestBed.configureTestingModule({
      providers: [CartStore, { provide: AuthStore, useValue: { user: userSignal } }],
    });

    store = TestBed.inject(CartStore);
    TestBed.tick();
  });

  describe('initial state', () => {
    it('starts empty', () => {
      expect(store.isEmpty()).toBe(true);
      expect(store.itemCount()).toBe(0);
      expect(store.total()).toBe(0);
      expect(store.items()).toEqual([]);
    });
  });

  describe('addItem()', () => {
    it('adds a new product', () => {
      const product = makeProduct('p1', 25);
      store.addItem(product);

      expect(store.isEmpty()).toBe(false);
      expect(store.itemCount()).toBe(1);
      expect(store.items()[0]).toEqual({ product, quantity: 1 });
    });

    it('increments quantity when the same product is added again', () => {
      const product = makeProduct('p1', 25);
      store.addItem(product);
      store.addItem(product, 2);

      expect(store.items()).toHaveLength(1);
      expect(store.itemCount()).toBe(3);
    });

    it('adds different products as separate entries', () => {
      store.addItem(makeProduct('p1', 25));
      store.addItem(makeProduct('p2', 40));

      expect(store.items()).toHaveLength(2);
    });
  });

  describe('removeItem()', () => {
    it('removes the item by productId', () => {
      store.addItem(makeProduct('p1', 25));
      store.addItem(makeProduct('p2', 40));
      store.removeItem('p1');

      expect(store.items()).toHaveLength(1);
      expect(store.items()[0].product.id).toBe('p2');
    });

    it('is a no-op for an id not in the cart', () => {
      store.addItem(makeProduct('p1', 25));
      store.removeItem('nonexistent');

      expect(store.items()).toHaveLength(1);
    });
  });

  describe('updateQuantity()', () => {
    it('updates the quantity of an existing item', () => {
      store.addItem(makeProduct('p1', 25));
      store.updateQuantity('p1', 5);

      expect(store.items()[0].quantity).toBe(5);
    });

    it('removes the item when quantity is set to 0', () => {
      store.addItem(makeProduct('p1', 25));
      store.updateQuantity('p1', 0);

      expect(store.isEmpty()).toBe(true);
    });

    it('removes the item when quantity is negative', () => {
      store.addItem(makeProduct('p1', 25));
      store.updateQuantity('p1', -1);

      expect(store.isEmpty()).toBe(true);
    });
  });

  describe('clear()', () => {
    it('empties the cart', () => {
      store.addItem(makeProduct('p1', 25));
      store.addItem(makeProduct('p2', 40));
      store.clear();

      expect(store.isEmpty()).toBe(true);
      expect(store.itemCount()).toBe(0);
    });
  });

  describe('total()', () => {
    it('computes price × quantity for all items', () => {
      store.addItem(makeProduct('p1', 25), 2);
      store.addItem(makeProduct('p2', 40), 1);

      expect(store.total()).toBe(90);
    });
  });

  describe('localStorage persistence', () => {
    it('persists items under the anonymous key', () => {
      store.addItem(makeProduct('p1', 25));

      const stored = JSON.parse(localStorage.getItem(ANON_KEY)!) as CartItem[];
      expect(stored).toHaveLength(1);
      expect(stored[0].product.id).toBe('p1');
    });

    it('restores items from localStorage on init', () => {
      const existing: CartItem[] = [{ product: makeProduct('p1', 25), quantity: 3 }];
      localStorage.setItem(ANON_KEY, JSON.stringify(existing));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [CartStore, { provide: AuthStore, useValue: { user: signal(null) } }],
      });
      const freshStore = TestBed.inject(CartStore);
      TestBed.tick();

      expect(freshStore.itemCount()).toBe(3);
    });

    it('uses a user-scoped key when a user is authenticated', () => {
      userSignal.set({ uid: 'user-123' } as AppUser);
      TestBed.tick();

      store.addItem(makeProduct('p1', 25));

      expect(localStorage.getItem(USER_KEY)).not.toBeNull();
      expect(localStorage.getItem(ANON_KEY)).toBeNull();
    });

    it('loads the user cart when the auth state changes to logged-in', () => {
      store.addItem(makeProduct('p1', 25));

      const userItems: CartItem[] = [
        { product: makeProduct('p2', 40), quantity: 2 },
        { product: makeProduct('p3', 10), quantity: 1 },
      ];
      localStorage.setItem(USER_KEY, JSON.stringify(userItems));

      userSignal.set({ uid: 'user-123' } as AppUser);
      TestBed.tick();

      expect(store.itemCount()).toBe(3);
      expect(store.items()[0].product.id).toBe('p2');
    });
  });
});
