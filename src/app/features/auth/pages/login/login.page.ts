import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService, CognitoService } from '@core/services';
import { User } from '@core/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterLink],
})
export class LoginPage {

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private cognito: CognitoService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {
    addIcons({ mailOutline, lockClosedOutline });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    try {
      const result = await this.cognito.login(
        this.form.value.email!,
        this.form.value.password!,
      );

      if (result.isSignedIn) {
        const cognitoUser = await this.cognito.getCurrentCognitoUser();
        const token = await this.cognito.getToken();
        const attributes = await this.cognito.getUserAttributes();
        console.log('Atributos Cognito:', JSON.stringify(attributes));

        const user: User = {
          id: cognitoUser?.userId ?? '',
          email: this.form.value.email!,
          name: attributes?.['name'] ?? attributes?.['email'] ?? this.form.value.email!,
          role: 'user',
          token: token ?? '',
        };

        await this.auth.login(user);
        await loading.dismiss();
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        await loading.dismiss();
        await this.showToast('Se requiere un paso adicional de verificación.');
      }

    } catch (error: any) {
      await loading.dismiss();
      const message = this.getErrorMessage(error);
      await this.showToast(message);
    }
  }

  private getErrorMessage(error: any): string {
    switch (error.name) {
      case 'UserNotFoundException':
        return 'Usuario no encontrado.';
      case 'NotAuthorizedException':
        return 'Contraseña incorrecta.';
      case 'UserNotConfirmedException':
        return 'Debes confirmar tu cuenta primero.';
      case 'PasswordResetRequiredException':
        return 'Debes restablecer tu contraseña.';
      default:
        return error.message ?? 'No se pudo iniciar sesión.';
    }
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: 'danger',
      position: 'top',
    });
    await toast.present();
  }
}