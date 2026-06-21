import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule
} from '@angular/common/http';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';
import { ErrorInterceptor } from '@core/interceptors/error.interceptor';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
  ],
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parent?: CoreModule
  ) {
    if (parent) {
      throw new Error(
        'CoreModule ya cargado. Solo importar en AppModule.'
      );
    }
  }
}