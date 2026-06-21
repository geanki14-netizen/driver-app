import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '@core/services';

@Component({
    selector: 'app-splash',
    templateUrl: './splash.page.html',
    styleUrls: ['./splash.page.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule],
})
export class SplashPage implements OnInit {

    constructor(
        private auth: AuthService,
        private router: Router,
    ) { }

    async ngOnInit(): Promise<void> {
        // Pequeña pausa para mostrar el splash personalizado
        await this.delay(1200);

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