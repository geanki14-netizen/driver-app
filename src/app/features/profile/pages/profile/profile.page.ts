import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ProfilePage {

  constructor(private auth: AuthService) {}

  get currentUser() {
    return this.auth.getCurrentUser();
  }
}