import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { LogService } from './services/log.service';
import { DEFAULT_ERROR } from '@shared/constants';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private logService: LogService,
    private toastCtrl: ToastController,
    private zone: NgZone,
  ) {}

  handleError(error: unknown): void {
    const message = this.extractMessage(error);

    this.logService.error('Error no manejado capturado por GlobalErrorHandler', error);

    // NgZone.run() es necesario porque el ErrorHandler corre fuera
    // de la zona de Angular — sin esto el Toast no se renderiza
    this.zone.run(() => {
      this.showToast(message);
    });
  }

  private extractMessage(error: unknown): string {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>;
      if (typeof err['message'] === 'string') return err['message'];
    }
    return DEFAULT_ERROR;
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: 'danger',
      position: 'top',
      buttons: [{ text: 'OK', role: 'cancel' }],
    });
    await toast.present();
  }
}