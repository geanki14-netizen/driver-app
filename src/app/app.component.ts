import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './core/services/auth.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(private auth: AuthService) {}

  async ngOnInit(): Promise<void> {
    await this.auth.init();
    console.log('🌍 Ambiente activo:', environment.envName, '| API:', environment.apiUrl);
  }
}