import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationClassDirective } from '@core/directives/app-validation-class.directive';
import { SoloNumerosDirective } from '@core/directives/solo-numeros.directive';
import { CardFormularioValidacionComponent } from '@core/shared/components/card-formulario-validacion/card-formulario-validacion.component';
import { CardFormularioValidacion } from '@core/shared/components/card-formulario-validacion/model/cardFormValidacion.type';
import { datosResumen } from '@core/shared/components/card-formulario-validacion/model/datosResumen.type';
import { CartaComponent } from '@core/shared/components/carta/carta.component';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { VerificacionFechasLimiteService } from '@core/shared/service/VerficacionFechasLimites.service';
import { professor } from '@core/shared/types';
import { UnicesarValidator } from '@core/shared/Validators';
import {
  documentNumberValidator,
  longitudExactaValidator,
} from '@core/shared/Validators/RangeValidator.type';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { professorStore } from 'src/app/features/professor/store/professor.store';
import { documentTypes } from 'src/app/utils/const/documentTypes.const';
import { genre } from 'src/app/utils/const/genre.const';
import { dataCrearProfessor } from '../../const/data-crearProfessor.const';
import { dataVerProfessor } from '../../const/data-verProfessor.const';
import { datosProfessorVerificacion } from '../../const/datosProfessorVerificar';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { throwError } from 'rxjs';

interface documentType {
  id: number;
  documentType: string;
}
@Component({
  selector: 'app-register-profesor',
  imports: [
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    CommonModule,
    SelectModule,
    InputNumberModule,
    AutoCompleteModule,
    CartaComponent,
    SoloNumerosDirective,
    ValidationClassDirective,
    CardFormularioValidacionComponent,
    ConfirmDialogModule,
  ],
  templateUrl: './register-profesor.component.html',
  styleUrl: './register-profesor.component.scss',
})
export default class RegisterProfesorComponent implements OnInit {
  //services
  edadadService = inject(VerificacionFechasLimiteService);
  formErroresService = inject(ErroesformService);
  alertService = inject(AlertasService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  //store
  professorStore = inject(professorStore);
  //formularios
  formRegister!: FormGroup;
  form = inject(FormBuilder);
  router = inject(ActivatedRoute);
  navigate = inject(Router);

  //signals
  documentsTypes = signal<documentType[] | []>(documentTypes);
  datos = signal<CardFormularioValidacion>(dataCrearProfessor);
  isEditar = signal(false);
  progress = signal<number>(0);
  checked: boolean = false;
  generos = genre;
  data = dataCrearProfessor;
  validacionData = signal<datosResumen[] | []>([]);
  professorId = signal<string>('');

  RegisterForm() {
    this.formRegister = this.form.group({
      user: this.form.group({
        institutionalEmail: ['', [Validators.required, UnicesarValidator()]],
        password: ['', Validators.required],
      }),
      specialty: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      birthPlace: ['', [Validators.required]],
      placeOfResidence: ['', [Validators.required]],
      documentNumber: [
        '',
        [Validators.required, documentNumberValidator(6, 10)],
      ],
      documentType: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, longitudExactaValidator(10)]],
    });
  }
  nuevoProfessor() {
    this.formRegister.reset();
    this.progress.set(0);
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

  async enviarDatos(professor: professor) {
    try {
      const response = await this.professorStore.createProfessor(professor);
      if (!response) {
        throw Error;
      }
      this.resumenDatos(response.data);
    } catch (error: HttpErrorResponse | any) {
      this.alertService.showError(error.error.message);
      throw error;
    }
  }

  ngOnInit() {
    this.RegisterForm();
    this.obtenerIdProfessor();
  }

  obtenerIdProfessor() {
    const id = this.router.snapshot.queryParamMap.get('id');
    if (id) {
      this.professorId.set(id);
    }
  }

  getProfessor = injectQuery(() => ({
    queryKey: ['professor', this.professorId()],
    queryFn: async () => {
      try {
        const response = this.professorStore.getProfessor(this.professorId());
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
  }));

  setData = effect(() => {
    const datos = this.getProfessor.data()?.data;
    if (datos) {
      this.formRegister.patchValue(datos);
      this.isEditar.set(true);
      this.datos.set(dataVerProfessor);
    }
  });
  resumenDatos(profesor: professor) {
    this.validacionData.set(datosProfessorVerificacion(profesor));
    this.alertService.showSuccess(
      'Registrado!',
      'Se registro la convocatoria :D'
    );
    this.siguiente();
  }
  siguiente() {
    if (this.progress() < 1) {
      this.progress.update((current) => current + 1);
    }
  }
  tipoDeAccion() {
    if (this.isEditar()) {
      this.isEditar();
      console.log('editar');
    } else {
      this.confirm1();
    }
  }

  confirm1() {
    this.confirmationService.confirm({
      message: 'Estas seguro de continuar? Verifica los datos!',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        this.enviarFormulario();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }
}
