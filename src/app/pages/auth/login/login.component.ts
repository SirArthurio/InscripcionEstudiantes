import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { login } from './model/Login.type';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { CardFormularioComponent } from '../../../core/shared/components/card-formulario/card-formulario.component';
import { datosLogin } from './const/datos-login.const';
import { loginStore } from '../store/auth.store';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { currentStore } from '../store/current.store';
import { UserRole } from '@core/shared/types/currentUser.type';
import { Dialog } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import SendInstitucionalEmailComponent from '../send-institucional-email/send-institucional-email.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule,
    RippleModule,
    ReactiveFormsModule,
    MessageModule,
    CommonModule,
    CardFormularioComponent,
    Dialog,
    ToastModule,
    SendInstitucionalEmailComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  //service
  errorService = inject(ErroesformService);
  alertService = inject(AlertasService);
  route = inject(Router);
  //store
  currentStore = inject(currentStore);
  loginStore = inject(loginStore);
  //form
  formLogin!: FormGroup;
  form = inject(FormBuilder);
  //variables
  email = signal<string>('');
  visible = signal(false);
  datos = datosLogin;
  LoginForm() {
    this.formLogin = this.form.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }
  enviarFormulario() {
    if (this.formLogin.valid) {
      this.enviarDatos(this.formLogin.value);
    } else {
      this.ErroresFormularioLogin();
    }
  }
  async obtenerDatosUsuario() {
    try {
      const response = await this.currentStore.currentUser(
        this.loginStore.token()
      );

      if (response) {
        console.log('datos que llegan: ', response);
        const user = response.data.user;
        const userType = user!.role as keyof UserRole;

        this.currentStore.setUser(user!);
        console.log('type:', userType);
        const userData = response.data[userType];
        console.log('datos que se van: ', userData);
        if (userData) {
          this.currentStore.setUserData(userType, userData);
          this.currentStore.setLocalUserData();
          this.currentStore.setLocalUser();
          this.navegar();
        } else throw Error;
      } else throw Error;
    } catch (error) {
      throw error;
    }
  }
  validateActivo() {
    this.visible.set(true);
    this.email.set(this.formLogin.get('username')?.value);
  }

  navegar() {
    this.alertService.showSuccess('Exito', 'Login Exitoso');
    this.route.navigate(['/']);
  }
  async enviarDatos(usuario: login) {
    try {
      const response = await this.loginStore.login(usuario);
      if (response) {
        this.loginStore.setToken(response.data.accessToken);
        this.loginStore.setTokenLocal();
        this.obtenerDatosUsuario();
      }
    } catch (error: HttpErrorResponse | any) {
      if (
        error?.error?.message ==
        'Tu correo electrónico aún no ha sido verificado.Para acceder a tu cuenta, primero debes verificar tu dirección de correo.'
      ) {
        this.validateActivo();
      } else if (error?.status == 401) {
        this.alertService.showError(`verifica tus credenciales`);
        console.log(error);
      } else {
        this.alertService.showError(`${error?.error?.message}`);
      }
    }
  }
  ErroresFormularioLogin() {
    this.errorService.marcarFormularioError(this.formLogin);
    this.alertService.showErrors(
      this.errorService.mostrarErroresFormulario(this.formLogin)
    );
  }
  ngOnInit() {
    this.LoginForm();
  }
}
