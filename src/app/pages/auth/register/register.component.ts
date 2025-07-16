import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { login } from '../../../core/shared/models/type/AUTH/Login.type';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { UnicesarValidator } from '../../../core/shared/models/type/Validators/UnicesarValidator.type';
import { documentTypes } from '../../../utils/const/documentTypes.const';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-register',
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
    SelectModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  formRegister!: FormGroup;
  form = inject(FormBuilder);
  route = inject(Router);
  email: string = '';

  password: string = '';

  checked: boolean = false;
  documentsTypes = documentTypes;
  RegisterForm() {
    this.formRegister = this.form.group({
      email: ['', [Validators.required, UnicesarValidator()]],
      password: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      birthdate: ['', Validators.required],
      documentNumber: ['', Validators.required],
      documentType: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }
  enviarFormulario() {
    if (this.formRegister.valid) {
      this.enviarDatos(this.formRegister.value);
      this.route.navigate(['/']);
    } else {
      this.formRegister.markAsDirty();
      console.log('error', this.formRegister.value);
    }
  }
  enviarDatos(usuario: login) {
    console.log(usuario);
  }
  ngOnInit() {
    this.RegisterForm();
  }
}
