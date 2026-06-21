import { HttpErrorResponse } from '@angular/common/http';
import { Observable, OperatorFunction, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ERROR_MESSAGES, DEFAULT_ERROR } from '@shared/constants';
import { LogService } from './log.service';

export abstract class BaseService {

  constructor(protected logService: LogService) {}

  protected handleError(serviceName: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      const message = ERROR_MESSAGES[error.status] ?? DEFAULT_ERROR;

      this.logService.error(
        `[${serviceName}] Error ${error.status}: ${message}`,
        error
      );

      return throwError(() => ({
        status: error.status,
        message,
        original: error,
      }));
    };
  }

  protected catchAndHandle<T>(serviceName: string): OperatorFunction<T, T> {
    return catchError(this.handleError(serviceName));
  }
}