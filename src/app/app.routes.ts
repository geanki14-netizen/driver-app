import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@core/guards';

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
];