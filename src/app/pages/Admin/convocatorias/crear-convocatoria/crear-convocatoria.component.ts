import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { dataCrearConvocatoria } from './const/data-crearConvocatoria.const';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardFormularioValidacionComponent } from '../../../../core/shared/components/card-formulario-validacion/card-formulario-validacion.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { modalidad } from './const/modalidad.const';
import { DatePicker } from 'primeng/datepicker';
import { ErroesformService } from '../../../../core/shared/service/ErroresForm/erroesform.service';
import { AlertasService } from '../../../../core/shared/service/Alertas/alertas.service';
import { ButtonModule } from 'primeng/button';
import { DateFormatterService } from '../../../../core/shared/service/DateFormatter/date-formatter.service';
import { datosResumen } from '../../../../core/shared/components/card-formulario-validacion/model/datosResumen.type';
import { convocatoria } from './model/convocatoria.type';
import { datosConvocatoriaVerificacion } from './const/datosConvocatoriaVerificar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { CartaComponent } from '../../../../core/shared/components/carta/carta.component';
import { HttpErrorResponse } from '@angular/common/http';
import { convocatoriasStore } from '../store/convocatorias.store';
import { CardFormularioValidacion } from '@core/shared/components/card-formulario-validacion/model/cardFormValidacion.type';
import { dataVerConvocatoria } from './const/data-verConvocatoria.const';
@Component({
  selector: 'app-crear-convocatoria',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardFormularioValidacionComponent,
    InputTextModule,
    InputNumber,
    ConfirmDialog,
    ButtonModule,
    Select,
    DatePicker,
    ButtonModule,
    CartaComponent,
  ],
  templateUrl: './crear-convocatoria.component.html',
  styleUrl: './crear-convocatoria.component.scss',
})
export default class CrearConvocatoriaComponent implements OnInit, OnDestroy {
  //service
  alertasService = inject(AlertasService);
  erroresFormService = inject(ErroesformService);
  dateFormatterService = inject(DateFormatterService);

  //signals
  validacionData = signal<datosResumen[] | []>([]);
  progress = signal<number>(0);

  //formulario
  form = inject(FormBuilder);
  formConvocatoria!: FormGroup;

  //injecciones
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  convocatoriaStore = inject(convocatoriasStore);
  //variables
  isEditar = signal(false);
  datos = signal<CardFormularioValidacion>(dataCrearConvocatoria);
  modalidades = modalidad;
  minDate: Date = new Date();

  ngOnInit(): void {
    this.formularioConvocatoria();
  }
  ngOnDestroy(): void {
    this.convocatoriaStore.resetConvocatoria();
  }

  getConvocatoria = effect(() => {
    const response = this.convocatoriaStore.convocatoria();
    if (response) {
      this.formConvocatoria.patchValue(response);
      this.isEditar.set(true);
      this.datos.set(dataVerConvocatoria);
    } else {
      this.isEditar.set(false);
      this.datos.set(dataCrearConvocatoria);
    }
  });

  siguiente() {
    if (this.progress() < 1) {
      this.progress.update((current) => current + 1);
    }
  }

  formularioConvocatoria() {
    this.formConvocatoria = this.form.group({
      code: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      totalSlots: [0, [Validators.required]],
      modality: ['', [Validators.required]],
      rangeDates: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', []],
    });
  }

  convertirRangoAFechas() {
    const start = this.formConvocatoria.get('rangeDates')?.value?.[0];
    const end = this.formConvocatoria.get('rangeDates')?.value?.[1];
    if (end) {
      this.formConvocatoria.get('endDate')?.setValue(end);
    }
    this.formConvocatoria.get('startDate')?.setValue(start);
  }

  nuevaConvocatoria() {
    this.formConvocatoria.reset();
    this.progress.set(0);
  }

  resumenDatos(convocatoria: convocatoria) {
    this.validacionData.set(datosConvocatoriaVerificacion(convocatoria));
    this.alertasService.showSuccess(
      'Registrado!',
      'Se registro la convocatoria :D'
    );
    this.siguiente();
  }

  async enviarDatos(convocatoria: convocatoria) {
    try {
      const response = await this.convocatoriaStore.createConvocatorias(
        convocatoria
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

  convercionDatos(): convocatoria {
    const { rangeDates, ...rest } = this.formConvocatoria.value;
    return rest;
  }

  erroresForm() {
    this.erroresFormService.marcarFormularioError(this.formConvocatoria);
    this.alertasService.showErrors(
      this.erroresFormService.mostrarErroresFormulario(this.formConvocatoria)
    );
  }

  onSubmit() {
    this.convertirRangoAFechas();
    if (this.formConvocatoria.invalid) {
      this.erroresForm();
    } else {
      this.enviarDatos(this.convercionDatos());
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
