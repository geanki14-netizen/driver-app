import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { BaseService } from './base.service';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class ApiService extends BaseService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    logService: LogService,
  ) {
    super(logService);
  }

  get<T>(endpoint: string, params?: Record<string, string>): Observable<T> {
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;

    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, { params: httpParams })
      .pipe(this.catchAndHandle<T>(`GET ${endpoint}`));
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(this.catchAndHandle<T>(`POST ${endpoint}`));
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(this.catchAndHandle<T>(`PUT ${endpoint}`));
  }

  patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http
      .patch<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(this.catchAndHandle<T>(`PATCH ${endpoint}`));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`)
      .pipe(this.catchAndHandle<T>(`DELETE ${endpoint}`));
  }
}