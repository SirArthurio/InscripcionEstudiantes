import { Component, inject, OnInit } from '@angular/core';
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
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { login } from './model/Login.type';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { UnicesarValidator } from '../../../core/shared/Validators';

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
    AppFloatingConfigurator,
    ReactiveFormsModule,
    MessageModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  form = inject(FormBuilder);
  route = inject(Router);
  email: string = '';

  password: string = '';

  checked: boolean = false;
  LoginForm() {
    this.formLogin = this.form.group({
      email: ['', [Validators.required, UnicesarValidator()]],
      password: ['', Validators.required],
    });
  }
  enviarFormulario() {
    if (this.formLogin.valid) {
      this.enviarDatos(this.formLogin.value);
      this.route.navigate(['/']);
    } else {
      this.formLogin.markAsDirty();
      console.log('error', this.formLogin.value);
    }
  }
  enviarDatos(usuario: login) {
    console.log(usuario);
  }
  ngOnInit() {
    this.LoginForm();
  }
}
