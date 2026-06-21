import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HomePage {

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  get currentUser() {
    return this.auth.getCurrentUser();
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}