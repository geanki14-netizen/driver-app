import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User } from '@core/models';
import { BaseService } from './base.service';
import { LogService } from './log.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService extends BaseService {
  private http = inject(HttpClient);


  private baseUrl = environment.apiUrl;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    const logService = inject(LogService);

    super(logService);
  }

  login(credentials: LoginCredentials): Observable<User> {
    // json-server no tiene endpoint de auth real, así que
    // buscamos el usuario por email y verificamos el password
    return this.http
      .get<User[]>(
        `${this.baseUrl}/users?email=${credentials.email}`
      )
      .pipe(
        map(users => {
          const user = users[0];
          if (!user) {
            throw { status: 401, message: 'Usuario no encontrado' };
          }
          if ((user as any).password !== credentials.password) {
            throw { status: 401, message: 'Contraseña incorrecta' };
          }
          // No devolvemos el password al AuthService
          const { password, ...userWithoutPassword } = user as any;
          return userWithoutPassword as User;
        }),
        catchError(err => throwError(() => err))
      );
  }
}