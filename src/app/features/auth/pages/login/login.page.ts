import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { AuthService } from '@core/services';
import { User } from '@core/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class LoginPage {

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    try {
      // TODO Día 8-9: reemplazar este mock por la llamada real a la API
      const mockUser: User = {
        id: '1',
        email: this.form.value.email!,
        name: 'Usuario de prueba',
        role: 'user',
        token: 'fake-jwt-token-123',
      };

      await this.auth.login(mockUser);
      await loading.dismiss();
      this.router.navigateByUrl('/home');

    } catch (error) {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'No se pudo iniciar sesión. Verifica tus credenciales.',
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
      await toast.present();
    }
  }
}