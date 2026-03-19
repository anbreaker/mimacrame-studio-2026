import { Product } from './product.interface';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  itemCount: number;
  items: CartItem[];
  total: number;
}
