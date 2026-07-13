import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService, VersionCheckService } from '@core/services';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class SplashPage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private versionCheck = inject(VersionCheckService);

  async ngOnInit(): Promise<void> {
    // Mostrar splash brevemente
    await this.delay(1200);

    // Verificar versión antes de continuar
    await this.versionCheck.checkVersion();

    // Inicializar sesión y navegar
    await this.auth.init();

    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}