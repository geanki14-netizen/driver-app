import { Injectable } from '@angular/core';
import { Amplify } from 'aws-amplify';
import {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  SignInOutput,
} from 'aws-amplify/auth';
import { environment } from '@environments/environment';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class CognitoService {

  constructor(private log: LogService) {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: environment.cognito.userPoolId,
          userPoolClientId: environment.cognito.clientId,
        }
      }
    });
  }

  async login(email: string, password: string): Promise<SignInOutput> {
    try {
      const result = await signIn({ username: email, password });
      this.log.info('Cognito login exitoso:', email);
      return result;
    } catch (error) {
      this.log.error('Cognito login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut();
      this.log.info('Cognito logout exitoso');
    } catch (error) {
      this.log.error('Cognito logout error:', error);
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() ?? null;
    } catch {
      return null;
    }
  }

  async getCurrentCognitoUser() {
    try {
      return await getCurrentUser();
    } catch {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}