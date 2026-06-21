import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService, ApiService } from '@core/services';

interface Item {
  id: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HomePage implements OnInit {

  items: Item[] = [];
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private api: ApiService,
  ) {}

  get currentUser() {
    return this.auth.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.api.get<Item[]>('items').subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}