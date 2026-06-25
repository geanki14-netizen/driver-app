import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, InfiniteScrollCustomEvent, RefresherCustomEvent } from '@ionic/angular';
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
  page = 1;
  pageSize = 2;
  hasMore = true;

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

  loadItems(reset = false): void {
    if (reset) {
      this.page = 1;
      this.hasMore = true;
      this.items = [];
    }

    this.loading = true;
    this.api.get<Item[]>('items', {
      _page: String(this.page),
      _limit: String(this.pageSize),
    }).subscribe({
      next: (data) => {
        if (data.length < this.pageSize) {
          this.hasMore = false;
        }
        this.items = [...this.items, ...data];
        this.loading = false;
        this.page++;
      },
      error: () => {
        this.loading = false;
        this.hasMore = false;
      },
    });
  }

  onRefresh(event: RefresherCustomEvent): void {
    this.loadItems(true);
    event.detail.complete();
  }

  onInfiniteScroll(event: InfiniteScrollCustomEvent): void {
    if (!this.hasMore) {
      event.target.disabled = true;
      return;
    }
    this.loadItems();
    event.target.complete();
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}