export const ROUTES = {
  HOME: '',
  CATALOGO: 'catalogo',
  PRODUCTO: 'producto',
  PRODUCTO_ID: 'producto/:id',
  CARRITO: 'carrito',
  CHECKOUT: 'checkout',
  PEDIDO_CONFIRMADO: 'pedido-confirmado',
  ADMIN: 'admin',
  ADMIN_LOGIN: 'admin/login',
  ADMIN_DASHBOARD: 'admin/dashboard',
  ADMIN_PRODUCTOS: 'admin/productos',
  ADMIN_PRODUCTO_NUEVO: 'admin/productos/nueva',
  ADMIN_PRODUCTO_EDITAR: 'admin/productos/:id',
  ADMIN_PEDIDOS: 'admin/pedidos',
} as const;

export type RouteKey = keyof typeof ROUTES;
