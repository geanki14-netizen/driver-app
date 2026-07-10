import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonIcon, IonLabel, IonRouterOutlet,
  IonMenuToggle, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, personOutline, shieldCheckmarkOutline, logOutOutline } from 'ionicons/icons';
import { AuthService, NotificationService } from './core/services';
import { Capacitor } from '@capacitor/core';

interface MenuItem {
  title: string;
  url: string;
  icon: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule, IonApp, IonSplitPane, IonMenu, IonHeader, IonToolbar,
    IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel,
    IonRouterOutlet, IonMenuToggle, RouterLink, RouterLinkActive,
  ],
})
export class AppComponent implements OnInit {

  menuItems: MenuItem[] = [
    { title: 'Inicio', url: '/home', icon: 'home-outline' },
    { title: 'Mi Perfil', url: '/profile', icon: 'person-outline' },
    { title: 'Administración', url: '/admin', icon: 'shield-checkmark-outline', adminOnly: true },
  ];

  constructor(
    private auth: AuthService,
    private notifications: NotificationService,
    private router: Router,
    private alertCtrl: AlertController,
  ) {
    addIcons({ homeOutline, personOutline, shieldCheckmarkOutline, logOutOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.auth.init();

    // Push notifications solo en dispositivo nativo (no en browser)
    if (Capacitor.isNativePlatform()) {
      await this.notifications.init();
    }
  }

  get currentUser() {
    return this.auth.getCurrentUser();
  }

  get visibleMenuItems(): MenuItem[] {
    return this.menuItems.filter(item =>
      !item.adminOnly || this.currentUser?.role === 'admin'
    );
  }

  async confirmLogout(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro que deseas salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          role: 'destructive',
          handler: async () => {
            await this.auth.logout();
            this.router.navigateByUrl('/auth/login', { replaceUrl: true });
          },
        },
      ],
    });
    await alert.present();
  }
}