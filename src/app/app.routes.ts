import { Routes } from '@angular/router';

import { authGuard } from '@core/auth/auth.guard';
import { clientGuard } from '@core/auth/client.guard';
import { ROUTES } from '@core/const/routes';

export const routes: Routes = [
  {
    path: ROUTES.HOME,
    loadComponent: async () => (await import('./features/home/home.component')).HomeComponent,
  },
  {
    path: ROUTES.CATALOGUE,
    loadComponent: async () =>
      (await import('./features/catalogue/catalogue.component')).CatalogueComponent,
  },
  {
    path: ROUTES.PRODUCT_ID,
    loadComponent: async () =>
      (await import('./features/product-detail/product-detail.component')).ProductDetailComponent,
  },
  {
    path: ROUTES.CART,
    loadComponent: async () => (await import('./features/cart/cart.component')).CartComponent,
  },
  {
    path: ROUTES.CHECKOUT,
    loadComponent: async () =>
      (await import('./features/checkout/checkout.component')).CheckoutComponent,
  },
  {
    path: ROUTES.ORDER_CONFIRMED,
    loadComponent: async () =>
      (await import('./features/order-confirmation/order-confirmation.component'))
        .OrderConfirmationComponent,
  },
  {
    path: ROUTES.LOGIN,
    loadComponent: async () =>
      (await import('./features/client/login/client-login.component')).ClientLoginComponent,
  },
  {
    path: ROUTES.ACCOUNT,
    canActivate: [clientGuard],
    loadComponent: async () =>
      (await import('./features/client/account/account-shell.component')).AccountShellComponent,
    children: [
      {
        path: 'profile',
        loadComponent: async () =>
          (await import('./features/client/account/profile/account-profile.component'))
            .AccountProfileComponent,
      },
      {
        path: 'orders',
        loadComponent: async () =>
          (await import('./features/client/account/orders/account-orders.component'))
            .AccountOrdersComponent,
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
  {
    path: ROUTES.ADMIN_LOGIN,
    loadComponent: async () =>
      (await import('./features/admin/login/admin-login.component')).AdminLoginComponent,
  },
  {
    path: ROUTES.ADMIN,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: async () =>
          (await import('./features/admin/dashboard/admin-dashboard.component'))
            .AdminDashboardComponent,
      },
      {
        path: 'products',
        loadComponent: async () =>
          (await import('./features/admin/products/products-list/products-list.component'))
            .ProductsListComponent,
      },
      {
        path: 'products/new',
        loadComponent: async () =>
          (await import('./features/admin/products/product-form/product-form.component'))
            .ProductFormComponent,
      },
      {
        path: 'products/:id',
        loadComponent: async () =>
          (await import('./features/admin/products/product-form/product-form.component'))
            .ProductFormComponent,
      },
      {
        path: 'orders',
        loadComponent: async () =>
          (await import('./features/admin/orders/admin-orders.component')).AdminOrdersComponent,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
