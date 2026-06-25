import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { AuthService, AuthApiService } from '@core/services';

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
    private authApi: AuthApiService,
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

    this.authApi.login({
      email: this.form.value.email!,
      password: this.form.value.password!,
    }).subscribe({
      next: async (user) => {
        await this.auth.login(user);
        await loading.dismiss();
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      error: async (err) => {
        await loading.dismiss();
        const message = err?.message ?? 'No se pudo iniciar sesión.';
        const toast = await this.toastCtrl.create({
          message,
          duration: 3000,
          color: 'danger',
          position: 'top',
        });
        await toast.present();
      },
    });
  }
}