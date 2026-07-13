import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';

interface AppConfig {
  id: string;
  minVersion: string;
  currentVersion: string;
  androidUrl: string;
  iosUrl: string;
}

@Injectable({ providedIn: 'root' })
export class VersionCheckService {
  private http = inject(HttpClient);
  private alertCtrl = inject(AlertController);

  async checkVersion(): Promise<void> {
    try {
      const configs = await firstValueFrom(
        this.http.get<AppConfig[]>(`${environment.apiUrl}/app-config`)
      );

      if (!configs || configs.length === 0) return;

      const config = configs[0];
      const appVersion = environment.appVersion;

      if (this.isOutdated(appVersion, config.minVersion)) {
        await this.showUpdateAlert(config);
      }
    } catch (error) {
      // Si el endpoint no está disponible, no bloqueamos la app
      console.warn('No se pudo verificar la versión:', error);
    }
  }

  private isOutdated(current: string, minimum: string): boolean {
    const toNumbers = (v: string) => v.split('.').map(Number);
    const [cMaj, cMin, cPat] = toNumbers(current);
    const [mMaj, mMin, mPat] = toNumbers(minimum);

    if (cMaj !== mMaj) return cMaj < mMaj;
    if (cMin !== mMin) return cMin < mMin;
    return cPat < mPat;
  }

  private async showUpdateAlert(config: AppConfig): Promise<void> {
    const storeUrl = Capacitor.getPlatform() === 'ios'
      ? config.iosUrl
      : config.androidUrl;

    const alert = await this.alertCtrl.create({
      header: '🚀 Nueva versión disponible',
      message: `Hay una versión más reciente de la app (v${config.currentVersion}). Por favor actualiza para continuar usando DriverApp.`,
      backdropDismiss: false, // No se puede cerrar tocando afuera
      buttons: [
        {
          text: 'Actualizar ahora',
          handler: () => {
            window.open(storeUrl, '_system');
            return false; // No cierra el alert — fuerza la actualización
          }
        }
      ]
    });

    await alert.present();
  }
}