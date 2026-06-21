import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@core/models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private storage: StorageService) {}

  async init(): Promise<void> {
    const user = await this.storage.get<User>('auth_user');
    this.userSubject.next(user);
  }

  async login(user: User): Promise<void> {
    await this.storage.set('auth_token', user.token);
    await this.storage.set('auth_user', user);
    this.userSubject.next(user);
  }

  async logout(): Promise<void> {
    await this.storage.remove('auth_token');
    await this.storage.remove('auth_user');
    this.userSubject.next(null);
  }

  async getToken(): Promise<string | null> {
    return this.storage.get<string>('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }
}