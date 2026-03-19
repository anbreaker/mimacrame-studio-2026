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
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  stripePaymentIntentId: string;
  total: number;
  updatedAt: Date;
  userId: string | null;
}

export type OrderCreate = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
