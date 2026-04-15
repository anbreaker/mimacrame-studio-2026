import { OrderStatus } from '@core/const/order-status.const';

import { CartItem } from './cart.interface';

export type MaterialPreference = 'trust_artisan' | 'custom';

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
  materialDescription?: string;
  materialPreference?: MaterialPreference;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  stripePaymentIntentId: string;
  total: number;
  updatedAt: Date;
  userId: string | null;
}

export type OrderCreate = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
