import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./features/catalogue/catalogue.component').then(m => m.CatalogueComponent),
  },
  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail.component').then(
        m => m.ProductDetailComponent,
      ),
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./features/cart/cart.component').then(m => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
  },
  {
    path: 'pedido-confirmado',
    loadComponent: () =>
      import('./features/order-confirmation/order-confirmation.component').then(
        m => m.OrderConfirmationComponent,
      ),
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/login/admin-login.component').then(m => m.AdminLoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard.component').then(
            m => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./features/admin/products/products-list/products-list.component').then(
            m => m.ProductsListComponent,
          ),
      },
      {
        path: 'productos/nueva',
        loadComponent: () =>
          import('./features/admin/products/product-form/product-form.component').then(
            m => m.ProductFormComponent,
          ),
      },
      {
        path: 'productos/:id',
        loadComponent: () =>
          import('./features/admin/products/product-form/product-form.component').then(
            m => m.ProductFormComponent,
          ),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./features/admin/orders/admin-orders.component').then(
            m => m.AdminOrdersComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
