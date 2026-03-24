export const CHECKOUT_ERROR = {
  CardDeclined: 'card_declined',
  Generic: 'generic',
  OrderCreation: 'order_creation',
} as const;

export type CheckoutError = (typeof CHECKOUT_ERROR)[keyof typeof CHECKOUT_ERROR];
