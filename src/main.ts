import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { ErrorHandler, inject, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { from, switchMap } from 'rxjs';
import { AuthService } from './app/core/services/auth.service';
import { LogService } from './app/core/services/log.service';
import { GlobalErrorHandler } from './app/core/global-error-handler';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const auth = inject(AuthService);

  return from(auth.getToken()).pipe(
    switchMap(token => {
      if (token) {
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
      }
      return next(req);
    })
  );
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: ErrorHandler,
      useFactory: (log: LogService, toast: ToastController, zone: NgZone) =>
        new GlobalErrorHandler(log, toast, zone),
      deps: [LogService, ToastController, NgZone],
    },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ],
});