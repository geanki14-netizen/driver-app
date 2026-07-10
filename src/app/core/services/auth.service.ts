import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@core/models';
import { StorageService } from './storage.service';
import { CognitoService } from './cognito.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> = this.userSubject.asObservable();

  constructor(
    private storage: StorageService,
    private cognito: CognitoService,
  ) {}

  async init(): Promise<void> {
    // Verificar si hay sesión activa en Cognito
    const isAuth = await this.cognito.isAuthenticated();
    if (isAuth) {
      const user = await this.storage.get<User>('auth_user');
      this.userSubject.next(user);
    } else {
      this.userSubject.next(null);
    }
  }

  async login(user: User): Promise<void> {
    await this.storage.set('auth_user', user);
    this.userSubject.next(user);
  }

  async logout(): Promise<void> {
    await this.cognito.logout();
    await this.storage.remove('auth_user');
    this.userSubject.next(null);
  }

  async getToken(): Promise<string | null> {
    // Siempre obtener el token fresco de Cognito
    return this.cognito.getToken();
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }
}