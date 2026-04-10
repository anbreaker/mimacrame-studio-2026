import { Routes } from '@angular/router';

import { authGuard } from '@core/auth/auth.guard';
import { clientGuard } from '@core/auth/client.guard';
import { ROUTES } from '@core/const/routes';

const publicRoutes: Routes = [
  {
    loadComponent: async () => (await import('./features/home/home.component')).HomeComponent,
    path: ROUTES.HOME,
  },
  {
    loadComponent: async () =>
      (await import('./features/catalogue/catalogue.component')).CatalogueComponent,
    path: ROUTES.CATALOGUE,
  },
  {
    loadComponent: async () =>
      (await import('./features/product-detail/product-detail.component')).ProductDetailComponent,
    path: ROUTES.PRODUCT_ID,
  },
  {
    loadComponent: async () => (await import('./features/about/about.component')).AboutComponent,
    path: ROUTES.ABOUT,
  },
  {
    loadComponent: async () => (await import('./features/cart/cart.component')).CartComponent,
    path: ROUTES.CART,
  },
  {
    loadComponent: async () =>
      (await import('./features/order-confirmation/order-confirmation.component'))
        .OrderConfirmationComponent,
    path: ROUTES.ORDER_CONFIRMED,
  },
];

const clientRoutes: Routes = [
  {
    loadComponent: async () =>
      (await import('./features/client/login/client-login.component')).ClientLoginComponent,
    path: ROUTES.LOGIN,
  },
  {
    canActivate: [clientGuard],
    loadComponent: async () =>
      (await import('./features/checkout/checkout.component')).CheckoutComponent,
    path: ROUTES.CHECKOUT,
  },
  {
    loadComponent: async () =>
      (await import('./features/client/register/client-register.component'))
        .ClientRegisterComponent,
    path: ROUTES.REGISTER,
  },
  {
    canActivate: [clientGuard],
    children: [
      {
        loadComponent: async () =>
          (await import('./features/client/account/profile/account-profile.component'))
            .AccountProfileComponent,
        path: 'profile',
      },
      {
        loadComponent: async () =>
          (await import('./features/client/account/orders/account-orders.component'))
            .AccountOrdersComponent,
        path: 'orders',
      },
    ],
    loadComponent: async () =>
      (await import('./features/client/account/account-shell.component')).AccountShellComponent,
    path: ROUTES.ACCOUNT,
  },
];

const adminRoutes: Routes = [
  {
    loadComponent: async () =>
      (await import('./features/admin/login/admin-login.component')).AdminLoginComponent,
    path: ROUTES.ADMIN_LOGIN,
  },
  {
    canActivate: [authGuard],
    children: [
      {
        loadComponent: async () =>
          (await import('./features/admin/dashboard/admin-dashboard.component'))
            .AdminDashboardComponent,
        path: 'dashboard',
      },
      {
        loadComponent: async () =>
          (await import('./features/admin/products/products-list/products-list.component'))
            .ProductsListComponent,
        path: 'products',
      },
      {
        loadComponent: async () =>
          (await import('./features/admin/products/product-form/product-form.component'))
            .ProductFormComponent,
        path: 'products/new',
      },
      {
        loadComponent: async () =>
          (await import('./features/admin/products/product-form/product-form.component'))
            .ProductFormComponent,
        path: 'products/:id',
      },
      {
        loadComponent: async () =>
          (await import('./features/admin/orders/admin-orders.component')).AdminOrdersComponent,
        path: 'orders',
      },
      {
        loadComponent: async () =>
          (await import('./features/admin/posts/posts-list/posts-list.component'))
            .PostsListComponent,
        path: 'posts',
      },
      {
        loadComponent: async () =>
          (await import('./features/admin/posts/post-form/post-form.component')).PostFormComponent,
        path: 'posts/new',
      },
      {
        loadComponent: async () =>
          (await import('./features/admin/posts/post-form/post-form.component')).PostFormComponent,
        path: 'posts/:id',
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
    path: ROUTES.ADMIN,
  },
];

export const routes: Routes = [
  ...publicRoutes,
  ...clientRoutes,
  ...adminRoutes,
  {
    loadComponent: async () =>
      (await import('./features/not-found/not-found.component')).NotFoundComponent,
    path: '**',
  },
];
