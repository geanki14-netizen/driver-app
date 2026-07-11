import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
} from '@capacitor/push-notifications';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private router = inject(Router);
  private log = inject(LogService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {}

  async init(): Promise<void> {
    // Verificar y solicitar permisos
    const permission = await PushNotifications.requestPermissions();

    if (permission.receive !== 'granted') {
      this.log.warn('Permisos de notificación denegados por el usuario');
      return;
    }

    await PushNotifications.register();
    this.registerListeners();
  }

  private registerListeners(): void {

    // Token registrado exitosamente — enviarlo al backend
    PushNotifications.addListener('registration', (token: Token) => {
      this.log.info('Device token registrado:', token.value);
      // TODO: enviar token al backend para almacenarlo
      // this.api.post('devices/token', { token: token.value }).subscribe();
    });

    // Error al registrar
    PushNotifications.addListener('registrationError', (error) => {
      this.log.error('Error al registrar push notifications:', error);
    });

    // Notificación recibida con app en foreground
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        this.log.info('Notificación recibida en foreground:', notification);
        // Aquí puedes mostrar un IonToast custom si quieres
      }
    );

    // Usuario tapeó la notificación (app en background o cerrada)
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        this.log.info('Notificación tapeada:', action);
        const data = action.notification.data;

        // Deep linking — navegar a pantalla específica según los datos
        if (data?.route) {
          this.router.navigateByUrl(data.route);
        }
      }
    );
  }

  async clearBadge(): Promise<void> {
    await PushNotifications.removeAllDeliveredNotifications();
  }
}