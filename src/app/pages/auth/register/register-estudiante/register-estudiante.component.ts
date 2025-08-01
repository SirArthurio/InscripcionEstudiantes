import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { VerificacionFechasLimiteService } from '@core/shared/service/VerficacionFechasLimites.service';
import { programs } from '@core/shared/types/programas.type';
import { UnicesarValidator } from '@core/shared/Validators';
import {
  documentNumberValidator,
  longitudExactaValidator,
} from '@core/shared/Validators/RangeValidator.type';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { documentTypes } from 'src/app/utils/const/documentTypes.const';
import { genre } from 'src/app/utils/const/genre.const';
import { programas } from 'src/app/utils/const/programs.const';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { RegisterGenericComponent } from '../components/register-generic/register-generic.component';
import { registerEstudianteConstData } from './const/register-estudiante.const';
import { RegisterStudentService } from '../service/registerStudent.service';
import { student } from '@core/shared/types/users/estudiante.type';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { SoloNumerosDirective } from '@core/directives/solo-numeros.directive';
import { ValidationClassDirective } from '@core/directives/app-validation-class.directive';
interface documentType {
  id: number;
  documentType: string;
}
@Component({
  selector: 'app-register-estudiante',
  imports: [
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    CommonModule,
    SelectModule,
    InputNumberModule,
    AutoCompleteModule,
    RegisterGenericComponent,
    SoloNumerosDirective,
    ValidationClassDirective,
  ],
  templateUrl: './register-estudiante.component.html',
  styleUrl: './register-estudiante.component.scss',
})
export default class RegisterEstudianteComponent implements OnInit {
  //services
  edadadService = inject(VerificacionFechasLimiteService);
  formErroresService = inject(ErroesformService);
  registerStudentService = inject(RegisterStudentService);
  alertService = inject(AlertasService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  //formularios
  formRegister!: FormGroup;
  form = inject(FormBuilder);
  route = inject(Router);

  //signals
  programas = signal<programs[] | []>(programas);
  documentsTypes = signal<documentType[] | []>(documentTypes);
  programFilteredValue = signal<programs[] | []>([]);

  checked: boolean = false;
  generos = genre;
  data = registerEstudianteConstData;

  filterProgram(event: AutoCompleteCompleteEvent) {
    const filtered: programs[] = [];
    const query = event.query;
    console.log('programas: ', this.programas());
    for (let i = 0; i < this.programas().length; i++) {
      const programa = this.programas()[i];
      if (programa.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        console.log('array:', programa);
        filtered.push(programa);
      }
    }

    this.programFilteredValue.set(filtered);
  }
  RegisterForm() {
    this.formRegister = this.form.group({
      user: this.form.group({
        institutionalEmail: ['', [Validators.required, UnicesarValidator()]],
        password: ['', Validators.required],
      }),

      name: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      program: ['', [Validators.required]],
      semester: [
        '',
        [Validators.required, Validators.min(1), Validators.max(20)],
      ],
      birthPlace: ['', [Validators.required]],
      placeOfResidence: ['', [Validators.required]],
      documentNumber: [
        '',
        [Validators.required, documentNumberValidator(6, 10)],
      ],
      documentType: ['', Validators.required],
      genre: ['', Validators.required],
      phoneNumber: ['', [Validators.required, longitudExactaValidator(10)]],
      admissionDate: ['', [Validators.required]],
    });
  }

  enviarFormulario() {
    if (this.formRegister.valid) {
      this.enviarDatos(this.formRegister.value);
    } else {
      this.manejoErroresForm();
    }
  }
  manejoErroresForm() {
    this.formErroresService.marcarFormularioError(this.formRegister);
    this.alertService.showErrors(
      this.formErroresService.mostrarErroresFormulario(this.formRegister)
    );
    console.log('error', this.formRegister);
  }
  async enviarDatos(student: student) {
    try {
      const response = await firstValueFrom(
        this.registerStudentService.RegisterStudent(student)
      );
      if (response) {
        this.confirmacion(response.message || '');
      }
      console.log(student);
    } catch (error: HttpErrorResponse | any) {
      this.alertService.showError(error.error.message);
      throw error;
    }
  }

  ngOnInit() {
    this.RegisterForm();
  }
  confirmacion(message: string) {
    this.confirmationService.confirm({
      message: `Desesas Verificar tu correo? recuerda que este paso es obligatorio y lo puedes hacer mas tarde :D`,
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        this.navegar();
      },
    });
  }
  navegar() {
    this.route.navigate(['/auth/send-intitucional-email']);
  }
}
