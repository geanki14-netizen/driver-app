import { Component, OnInit, inject } from '@angular/core';
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
    private auth = inject(AuthService);
    private router = inject(Router);

    /** Inserted by Angular inject() migration for backwards compatibility */
    constructor(...args: unknown[]);


    constructor() { }

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