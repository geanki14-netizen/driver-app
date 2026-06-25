import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class LogService {

  debug(message: string, ...args: unknown[]): void {
    if (environment.enableLogs) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (environment.enableLogs) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (environment.enableLogs) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    // El error siempre se loguea, en todos los ambientes
    console.error(`[ERROR] ${message}`, ...args);

    // En producción, aquí enviarías a Sentry u otro servicio
    if (environment.production) {
      this.sendToMonitoring(message, args);
    }
  }

  private sendToMonitoring(message: string, args: unknown[]): void {
    // TODO: integrar Sentry o similar cuando esté disponible
    // Sentry.captureException({ message, args });
    console.error('[MONITORING] Error enviado al servicio de monitoreo:', message);
  }
}