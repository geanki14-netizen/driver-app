import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { LogService } from '@core/services';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);
  private log = inject(LogService);


  step: 'register' | 'confirm' = 'register';
  email = '';

  registerForm = this.fb.group({
    name:            ['', [Validators.required, Validators.minLength(3)]],
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  confirmForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

 constructor() {
  addIcons({ personOutline, mailOutline, lockClosedOutline });
}

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm  = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  async onRegister(): Promise<void> {
    if (this.registerForm.invalid) return;

    const loading = await this.loadingCtrl.create({ message: 'Creando cuenta...' });
    await loading.present();

    try {
      const { email, password, name } = this.registerForm.value;

      await signUp({
        username: email!,
        password: password!,
        options: {
          userAttributes: {
            email: email!,
            name: name!,
          }
        }
      });

      this.email = email!;
      await loading.dismiss();
      this.step = 'confirm';
      await this.showToast('Código de verificación enviado a tu email.', 'success');

    } catch (error: any) {
      await loading.dismiss();
      await this.showToast(this.getErrorMessage(error), 'danger');
    }
  }

  async onConfirm(): Promise<void> {
    if (this.confirmForm.invalid) return;

    const loading = await this.loadingCtrl.create({ message: 'Verificando código...' });
    await loading.present();

    try {
      await confirmSignUp({
        username: this.email,
        confirmationCode: this.confirmForm.value.code!,
      });

      await loading.dismiss();
      await this.showToast('Cuenta verificada. Ya puedes iniciar sesión.', 'success');
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });

    } catch (error: any) {
      await loading.dismiss();
      await this.showToast(this.getErrorMessage(error), 'danger');
    }
  }

  private getErrorMessage(error: any): string {
    switch (error.name) {
      case 'UsernameExistsException':
        return 'Este email ya está registrado.';
      case 'InvalidPasswordException':
        return 'La contraseña no cumple los requisitos de seguridad.';
      case 'CodeMismatchException':
        return 'Código incorrecto. Intenta de nuevo.';
      case 'ExpiredCodeException':
        return 'El código expiró. Solicita uno nuevo.';
      default:
        return error.message ?? 'Ocurrió un error inesperado.';
    }
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  goToLogin(): void {
    this.router.navigateByUrl('/auth/login');
  }
}