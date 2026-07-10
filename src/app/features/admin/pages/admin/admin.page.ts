import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  shieldCheckmarkOutline, lockClosedOutline,
  peopleOutline, busOutline, ticketOutline, notificationsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class AdminPage {
  constructor() {
    addIcons({
      shieldCheckmarkOutline, lockClosedOutline,
      peopleOutline, busOutline, ticketOutline, notificationsOutline
    });
  }
}