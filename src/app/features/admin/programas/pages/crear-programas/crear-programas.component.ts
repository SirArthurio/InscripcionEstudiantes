import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardFormularioValidacion } from '@core/shared/components/card-formulario-validacion/model/cardFormValidacion.type';
import { datosResumen } from '@core/shared/components/card-formulario-validacion/model/datosResumen.type';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { DateFormatterService } from '@core/shared/service/DateFormatter/date-formatter.service';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { CartaComponent } from '@core/shared/components/carta/carta.component';
import { CardFormularioValidacionComponent } from '@core/shared/components/card-formulario-validacion/card-formulario-validacion.component';
import { CommonModule } from '@angular/common';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { programs } from '@core/shared/types/programas.type';
import { ActivatedRoute } from '@angular/router';
import { ValidationClassDirective } from '@core/directives/app-validation-class.directive';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { facultie } from '../../../facultades/model/facultie.type';
import { dataCrearPrograma } from '../../const/data-crearPrograma.const';
import { dataVerPrograma } from '../../const/data-verPrograma.const';
import { datosProgramaVerificacion } from '../../const/datosProgramasVerificacion';
import { programasStore } from '../../store/programas.store';

@Component({
  selector: 'app-crear-programas',
  imports: [
    Button,
    CartaComponent,
    CardFormularioValidacionComponent,
    ReactiveFormsModule,
    CommonModule,
    ConfirmDialog,
    InputText,
    ValidationClassDirective,
  ],
  templateUrl: './crear-programas.component.html',
  styleUrl: './crear-programas.component.scss',
})
export default class CrearProgramasComponent implements OnInit, OnDestroy {
  //service
  alertasService = inject(AlertasService);
  erroresFormService = inject(ErroesformService);
  dateFormatterService = inject(DateFormatterService);

  //signals
  validacionData = signal<datosResumen[] | []>([]);
  progress = signal<number>(0);

  //formulario
  form = inject(FormBuilder);
  formProgramas!: FormGroup;

  //injecciones
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  programaStore = inject(programasStore);
  router = inject(ActivatedRoute);

  //variables
  isEditar = signal(false);
  datos = signal<CardFormularioValidacion>(dataCrearPrograma);
  minDate: Date = new Date();
  facultades = signal<facultie[]>([]);
  idFacultad = signal<string>('');

  ngOnInit(): void {
    this.formularioPrograma();
    this.obtenerIdFacultad();
  }
  ngOnDestroy(): void {
    this.programaStore.resetProgramas();
  }
  private obtenerIdFacultad() {
    const id = this.router.snapshot.queryParamMap.get('facultad');
    if (id) {
      this.idFacultad.set(id);
    }
  }

  getProgramas = effect(() => {
    const response = this.programaStore.programa();
    if (response) {
      this.formProgramas.patchValue(response);
      this.isEditar.set(true);
      this.datos.set(dataVerPrograma);
    } else {
      this.isEditar.set(false);
      this.datos.set(dataCrearPrograma);
    }
  });

  siguiente() {
    if (this.progress() < 1) {
      this.progress.update((current) => current + 1);
    }
  }

  formularioPrograma() {
    this.formProgramas = this.form.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  nuevoPrograma() {
    this.formProgramas.reset();
    this.progress.set(0);
  }

  resumenDatos(programa: programs) {
    this.validacionData.set(datosProgramaVerificacion(programa));
    this.alertasService.showSuccess(
      'Registrado!',
      'Se registro la convocatoria :D'
    );
    this.siguiente();
  }

  async enviarDatos(programa: programs) {
    try {
      const response = await this.programaStore.createProgram(
        programa,
        this.idFacultad()
      );
      if (!response) {
        throw Error;
      }
      this.resumenDatos(response.data);
    } catch (error: HttpErrorResponse | any) {
      this.alertasService.showError(error.error.message);
      throw error;
    }
  }

  erroresForm() {
    this.erroresFormService.marcarFormularioError(this.formProgramas);
    this.alertasService.showErrors(
      this.erroresFormService.mostrarErroresFormulario(this.formProgramas)
    );
  }

  onSubmit() {
    if (this.formProgramas.invalid) {
      this.erroresForm();
    } else {
      this.enviarDatos(this.formProgramas.value);
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
        this.onSubmit();
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
