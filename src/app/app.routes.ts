import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { clientGuard } from './core/auth/client.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'catalogue',
    loadComponent: () =>
      import('./features/catalogue/catalogue.component').then((m) => m.CatalogueComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'order-confirmed',
    loadComponent: () =>
      import('./features/order-confirmation/order-confirmation.component').then(
        (m) => m.OrderConfirmationComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/client/login/client-login.component').then((m) => m.ClientLoginComponent),
  },
  {
    path: 'account',
    canActivate: [clientGuard],
    loadComponent: () =>
      import('./features/client/cuenta/cuenta-shell.component').then((m) => m.CuentaShellComponent),
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/client/cuenta/perfil/cuenta-perfil.component').then(
            (m) => m.CuentaPerfilComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/client/cuenta/pedidos/cuenta-pedidos.component').then(
            (m) => m.CuentaPedidosComponent
          ),
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/login/admin-login.component').then((m) => m.AdminLoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/products/products-list/products-list.component').then(
            (m) => m.ProductsListComponent
          ),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./features/admin/products/product-form/product-form.component').then(
            (m) => m.ProductFormComponent
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./features/admin/products/product-form/product-form.component').then(
            (m) => m.ProductFormComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/orders/admin-orders.component').then(
            (m) => m.AdminOrdersComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
