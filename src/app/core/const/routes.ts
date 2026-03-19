export const ROUTES = {
  ACCOUNT_ORDERS: 'account/orders',
  ACCOUNT_PROFILE: 'account/profile',
  ACCOUNT: 'account',
  ADMIN_DASHBOARD: 'admin/dashboard',
  ADMIN_LOGIN: 'admin/login',
  ADMIN_ORDERS: 'admin/orders',
  ADMIN_PRODUCT_EDIT: 'admin/products/:id',
  ADMIN_PRODUCT_NEW: 'admin/products/new',
  ADMIN_PRODUCTS: 'admin/products',
  ADMIN: 'admin',
  CART: 'cart',
  CATALOGUE: 'catalogue',
  CHECKOUT: 'checkout',
  HOME: '',
  LOGIN: 'login',
  ORDER_CONFIRMED: 'order-confirmed',
  PRODUCT_ID: 'product/:id',
  PRODUCT: 'product',
} as const;

export type RouteKey = keyof typeof ROUTES;
