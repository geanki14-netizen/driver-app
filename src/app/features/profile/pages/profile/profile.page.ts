import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '@core/services';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, shieldCheckmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ProfilePage {
  private auth = inject(AuthService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
  addIcons({ personOutline, mailOutline, shieldCheckmarkOutline });
}

  get currentUser() {
    return this.auth.getCurrentUser();
  }
}