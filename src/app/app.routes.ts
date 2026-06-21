import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from '@core/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./features/splash/pages/splash/splash.page')
        .then(m => m.SplashPage),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module')
        .then(m => m.AuthModule),
    canActivate: [guestGuard],
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module')
        .then(m => m.HomeModule),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/profile/profile.module')
        .then(m => m.ProfileModule),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module')
        .then(m => m.AdminModule),
    canActivate: [authGuard, roleGuard(['admin'])],
  },
];