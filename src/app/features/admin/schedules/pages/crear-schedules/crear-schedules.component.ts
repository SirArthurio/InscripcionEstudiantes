import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ValidationClassDirective } from '@core/directives/app-validation-class.directive';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { dataCrearSchedules } from '../../const/data-crear-schedules.const';
import { CardFormularioValidacion } from '@core/shared/components/card-formulario-validacion/model/cardFormValidacion.type';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { datosResumen } from '@core/shared/components/card-formulario-validacion/model/datosResumen.type';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { professor } from '@core/shared/types';
import { ConfirmationService, MessageService } from 'primeng/api';
import { professorStore } from 'src/app/features/professor/store/professor.store';
import { dataCrearProfessor } from '../../../professor/const/data-crearProfessor.const';
import { dataVerProfessor } from '../../../professor/const/data-verProfessor.const';
import { datosProfessorVerificacion } from '../../const/data-verificar-schedules';
import { CardFormularioValidacionComponent } from '@core/shared/components/card-formulario-validacion/card-formulario-validacion.component';
import { CommonModule } from '@angular/common';
import { dataDias } from '../../const/data-dias.const';
import { dataVerSchedules } from '../../const/data-ver-schedules.const';
import { CartaComponent } from '@core/shared/components/carta/carta.component';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-crear-schedules',
  imports: [
    Select,
    DatePickerModule,
    CartaComponent,
    Button,
    ValidationClassDirective,
    CardFormularioValidacionComponent,
    ReactiveFormsModule,
    CommonModule,
    ConfirmDialogModule,
    ValidationClassDirective,
  ],
  templateUrl: './crear-schedules.component.html',
  styleUrl: './crear-schedules.component.scss',
})
export default class CrearSchedulesComponent implements OnInit {
  //services
  formErroresService = inject(ErroesformService);
  alertService = inject(AlertasService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  //store
  professorStore = inject(professorStore);
  //formularios
  formSchedule!: FormGroup;
  form = inject(FormBuilder);
  dias = dataDias;
  //signals
  datos = signal<CardFormularioValidacion>(dataCrearSchedules);
  isEditar = signal(false);
  progress = signal<number>(0);
  checked: boolean = false;
  validacionData = signal<datosResumen[] | []>([]);

  RegisterForm() {
    this.formSchedule = this.form.group({
      schedules: this.form.array([this.schedulesForm()], [Validators.required]),
    });
  }
  get schedules() {
    return this.formSchedule.get('schedules') as FormArray;
  }
  schedulesForm(): FormGroup {
    return this.form.group({
      day: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
    });
  }
  nuevoHorario() {
    this.formSchedule.reset();
    this.progress.set(0);
  }
  enviarFormulario() {
    if (this.formSchedule.valid) {
      this.enviarDatos(this.formSchedule.value);
    } else {
      this.manejoErroresForm();
    }
  }
  manejoErroresForm() {
    console.log(this.formSchedule.errors);
    this.formErroresService.marcarFormularioError(this.formSchedule);
    this.alertService.showErrors(
      this.formErroresService.mostrarErroresFormulario(this.formSchedule)
    );
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
  }

  getProfessor = effect(() => {
    const response = this.professorStore.professor();
    if (response) {
      this.formSchedule.patchValue(response);
      this.isEditar.set(true);
      this.datos.set(dataVerSchedules);
    } else {
      this.isEditar.set(false);
      this.datos.set(dataCrearSchedules);
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
  agregarHorario() {
    console.log('general', this.formSchedule.value);
    if (this.schedules.invalid) {
      this.manejoErroresForm();
    } else {
      this.schedules.push(this.schedulesForm());
    }
  }

  // Eliminar horario
  eliminarHorario(index: number) {
    if (this.schedules.length > 1) {
      this.schedules.removeAt(index);
    }
  }
}
