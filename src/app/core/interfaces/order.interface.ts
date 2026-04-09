import { OrderStatus } from '@core/const/order-status.const';

import { CartItem } from './cart.interface';

export interface ShippingAddress {
  city: string;
  country: string;
  fullName: string;
  phone: string;
  postalCode: string;
  province: string;
  street: string;
}

export interface Order {
  createdAt: Date;
  customerEmail: string;
  id: string;
  items: CartItem[];
  lang: string;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  stripePaymentIntentId: string;
  total: number;
  updatedAt: Date;
  userId: string | null;
}

export type OrderCreate = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
