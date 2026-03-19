import { OrderStatus } from '@core/const/order-status.const';

import { CartItem } from './cart.interface';

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string | null;
  items: CartItem[];
  total: number;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  stripePaymentIntentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderCreate = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
