export const ORDER_STATUS = {
  Cancelled: 'cancelled',
  Delivered: 'delivered',
  Paid: 'paid',
  Pending: 'pending',
  Processing: 'processing',
  Refunded: 'refunded',
  Shipped: 'shipped',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
