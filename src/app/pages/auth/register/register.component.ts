import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { UnicesarValidator } from '../../../core/shared/Validators/UnicesarValidator.type';
import { documentTypes } from '../../../utils/const/documentTypes.const';
import { SelectModule } from 'primeng/select';
import { RegistroUsuario } from './model/Register.type';
import { VerificacionFechasLimiteService } from '../../../core/shared/service/VerficacionFechasLimites.service';
import { AlertasService } from '../../../core/shared/service/Alertas/alertas.service';
import { ToastModule } from 'primeng/toast';
import { ErroesformService } from '../../../core/shared/service/ErroresForm/erroesform.service';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  documentNumberValidator,
  longitudExactaValidator,
} from '../../../core/shared/Validators/RangeValidator.type';
import { programas, genre } from '../../../utils/const/index.const';
import { CardFormularioComponent } from '../../../core/shared/components/card-formulario/card-formulario.component';
import { dataRegister } from './const/data-register.const';

interface documentType {
  id: number;
  documentType: string;
}
@Component({
  selector: 'app-register',
  imports: [
    ToastModule,
    MessageModule,
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
    SelectModule,
    InputNumberModule,
    RouterLink,
    CardFormularioComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  edadadService = inject(VerificacionFechasLimiteService);
  formRegister!: FormGroup;
  form = inject(FormBuilder);
  formErroresService = inject(ErroesformService);
  route = inject(Router);
  alertService = inject(AlertasService);
  checked: boolean = false;
  generos = genre;
  programas = programas;
  documentsTypes = signal<documentType[] | []>(documentTypes);
  data = dataRegister;

  RegisterForm() {
    this.formRegister = this.form.group({
      email: ['', [Validators.required, UnicesarValidator()]],
      password: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      birthdate: ['', Validators.required],
      program: ['', [Validators.required]],
      semester: [
        '',
        [Validators.required, Validators.min(1), Validators.max(20)],
      ],
      placeBirth: ['', [Validators.required]],
      placeRecidence: ['', [Validators.required]],
      documentNumber: [
        '',
        [Validators.required, documentNumberValidator(6, 10)],
      ],
      documentType: ['', Validators.required],
      genre: ['', Validators.required],
      phone: ['', [Validators.required, longitudExactaValidator(10)]],
      entrydate: ['', [Validators.required]],
    });
  }

  enviarFormulario() {
    if (this.formRegister.valid) {
      this.enviarDatos(this.formRegister.value);
      this.route.navigate(['/auth/login']);
    } else {
      this.formErroresService.marcarFormularioError(this.formRegister);

      this.alertService.showErrors(
        this.formErroresService.mostrarErroresFormulario(this.formRegister)
      );
      console.log('error', this.formRegister);
    }
  }
  manejoErrores() {}
  enviarDatos(usuario: RegistroUsuario) {
    console.log(usuario);
  }
  ngOnInit() {
    this.RegisterForm();
  }
}
