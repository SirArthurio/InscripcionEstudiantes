import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { dataCrearConvocatoria } from '../../const/data-crearConvocatoria.const';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { modalidad } from '../../const/modalidad.const';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { convocatoria } from '../../model/convocatoria.type';
import { datosConvocatoriaVerificacion } from '../../const/datosConvocatoriaVerificar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { HttpErrorResponse } from '@angular/common/http';
import { CardFormularioValidacion } from '@core/shared/components/card-formulario-validacion/model/cardFormValidacion.type';
import { convocatoriaDTO } from '../../model/convocatoriaDTO.type';
import {
  editFechasConvocatoria,
  editTextConvocatoria,
} from '../ver-convocatorias/components/card-generic/model/edit.convocatoria.type';
import { ActivatedRoute, Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { dataVerConvocatoria } from '../../const/data-verConvocatoria.const';
import { CardFormularioValidacionComponent } from '@core/shared/components/card-formulario-validacion/card-formulario-validacion.component';
import { datosResumen } from '@core/shared/components/card-formulario-validacion/model/datosResumen.type';
import { CartaComponent } from '@core/shared/components/carta/carta.component';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { DateFormatterService } from '@core/shared/service/DateFormatter/date-formatter.service';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { convocatoriasStore } from '../../store/convocatorias.store';
import { TooltipModule } from 'primeng/tooltip';
import { statusConvocatorias } from '@core/shared/enums/status-convocatorias-type.enum';
@Component({
  selector: 'app-crear-convocatoria',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardFormularioValidacionComponent,
    InputTextModule,
    ConfirmDialog,
    ButtonModule,
    DatePicker,
    ButtonModule,
    CartaComponent,
    TooltipModule,
  ],
  templateUrl: './crear-convocatoria.component.html',
  styleUrl: './crear-convocatoria.component.scss',
})
export default class CrearConvocatoriaComponent implements OnInit, OnDestroy {
  //service
  alertasService = inject(AlertasService);
  erroresFormService = inject(ErroesformService);
  dateFormatterService = inject(DateFormatterService);
  navegar = inject(Router);

  //signals
  validacionData = signal<datosResumen[] | []>([]);
  progress = signal<number>(0);
  datosOriginales = signal<convocatoriaDTO | null>(null);

  //formulario
  form = inject(FormBuilder);
  formConvocatoria!: FormGroup;

  //injecciones
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  convocatoriaStore = inject(convocatoriasStore);
  router = inject(ActivatedRoute);

  //variables
  isEditar = signal(false);
  isActiva = signal(false);
  isFecha = signal(true);
  datos = signal<CardFormularioValidacion>(dataCrearConvocatoria);
  modalidades = modalidad;
  minDate: Date = new Date();
  convocatoriaId = signal<string>('');
  convocatoria = signal<convocatoriaDTO | null>(null);

  ngOnInit(): void {
    this.formularioConvocatoria();
    this.formConvocatoria.reset();

    this.obtenerConvocatoriaId();
  }
  ngOnDestroy(): void {
    this.convocatoriaStore.resetConvocatoria();
    this.formConvocatoria.reset();
  }
  private obtenerConvocatoriaId() {
    const id = this.router.snapshot.queryParamMap.get('convocatoriaId');
    if (id) {
      this.convocatoriaId.set(id);
    }
  }

  private estaActivaLaConvocatoria(convocatoria: convocatoriaDTO): boolean {
    return convocatoria.status === statusConvocatorias.publicada;
  }
  tienefecha = effect(() => {
    const fechaInicio = this.getConvocatoria.data()?.data.enrollmentEndDate;
    const fechaFinal = this.getConvocatoria.data()?.data.enrollmentStartDate;
    if (fechaFinal == null && fechaInicio == null) {
      this.isFecha.set(false);
    }
  });

  getConvocatoria = injectQuery(() => ({
    queryKey: ['convocatoria', this.convocatoriaId()],
    queryFn: async () => {
      try {
        const response = await this.convocatoriaStore.getConvocatoria(
          this.convocatoriaId()
        );
        if (!response) throw Error;
        if (this.estaActivaLaConvocatoria(response.data)) {
          this.isActiva.set(true);
        }

        this.isEditar.set(true);
        console.log('datos', response);
        this.datos.set(dataVerConvocatoria);
        return response;
      } catch (error) {
        throw error;
      }
    },
  }));

  setDatos = effect(() => {
    const response = this.getConvocatoria.data()?.data;

    if (response) {
      if (response.enrollmentEndDate == null) {
        console.log('seteando fecha ');
        this.isFecha.set(false);
      }
      this.datosOriginales.set(response);
      this.formConvocatoria.patchValue(response);
      var start = response.enrollmentStartDate;
      var end = response.enrollmentEndDate;

      const rangeDatesEnrollmentSet: [Date, Date] = [
        new Date(start),
        new Date(end),

        // DateFormatterService.createLocalDate()
      ];
      this.formConvocatoria.get('rangeDatesEnrollment')?.reset();

      this.formConvocatoria
        .get('rangeDatesEnrollment')
        ?.patchValue(rangeDatesEnrollmentSet);
    }
  });

  siguiente() {
    if (this.progress() < 1) {
      this.progress.update((current) => current + 1);
    }
  }

  formularioConvocatoria() {
    this.formConvocatoria = this.form.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      rangeDatesEnrollment: [''],
      enrollmentStartDate: [''],
      enrollmentEndDate: [''],
    });
  }
  convertirRangoAFechas() {
    const range = this.formConvocatoria.get('rangeDatesEnrollment')?.value;

    if (!range || range.length < 2) return;

    const startDate = new Date(range[0]).toISOString().split('T')[0];
    const endDate = new Date(range[1]).toISOString().split('T')[0];

    this.formConvocatoria.patchValue({
      enrollmentStartDate: startDate.toString(),
      enrollmentEndDate: endDate.toString(),
    });

    console.log('Fechas convertidas:', { startDate, endDate });
  }

  nuevaConvocatoria() {
    this.formConvocatoria.reset();
    this.progress.set(0);
  }

  resumenDatos(convocatoria: convocatoriaDTO) {
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
      this.convocatoria.set(response.data);
    } catch (error: HttpErrorResponse | any) {
      this.alertasService.showError(error.error.message);
      throw error;
    }
  }

  convercionDatos(): convocatoria {
    const { rangeDatesClass, rangeDatesEnrollment, ...rest } =
      this.formConvocatoria.value;
    return rest;
  }

  erroresForm() {
    this.erroresFormService.marcarFormularioError(this.formConvocatoria);
    this.alertasService.showErrors(
      this.erroresFormService.mostrarErroresFormulario(this.formConvocatoria)
    );
  }

  datosTextoEditatos(): editTextConvocatoria {
    return {
      name: this.formConvocatoria.value.name,
      description: this.formConvocatoria.value.description,
    };
  }

  datosFechaEditados(): editFechasConvocatoria {
    return {
      enrollmentStartDate: this.formConvocatoria.value.rangeDatesEnrollment[0],
      enrollmentEndDate: this.formConvocatoria.value.rangeDatesEnrollment[1],
    };
  }

  formularioTextoEditado(): editTextConvocatoria {
    const original = (this.datosOriginales() ??
      {}) as Partial<editTextConvocatoria>;
    const actual = this.datosTextoEditatos();
    const resultado: any = {};
    (Object.keys(actual) as (keyof editTextConvocatoria)[]).forEach((key) => {
      if (actual[key] !== original[key]) {
        resultado[key] = actual[key];
      } else {
        resultado[key] = null;
      }
    });
    return resultado as editTextConvocatoria;
  }

  formularioFechasEditado(): editFechasConvocatoria {
    const original = (this.datosOriginales() ??
      {}) as Partial<editFechasConvocatoria>;
    const actual = this.datosFechaEditados();
    const resultado: any = {};
    (Object.keys(actual) as (keyof editFechasConvocatoria)[]).forEach((key) => {
      if (actual[key] !== original[key]) {
        resultado[key] = actual[key];
      } else {
        resultado[key] = null;
      }
    });
    return resultado as editFechasConvocatoria;
  }

  onSubmit() {
    this.convertirRangoAFechas();
    console.log('comprobando :', this.formConvocatoria.value);
    if (this.formConvocatoria.invalid) {
      this.erroresForm();
    } else {
      this.enviarDatos(this.convercionDatos());
    }
  }

  private async editarConvocatoria() {
    try {
      console.log(this.formularioTextoEditado());
      this.convertirRangoAFechas();

      const response =
        await this.convocatoriaStore.updateInformationConvocatoria(
          this.convocatoriaId(),
          this.formularioTextoEditado()
        );
      if (!response) throw Error;
      this.messageService.add({
        severity: 'success',
        summary: 'Rejected',
        detail: `se Edito Con exito! :D`,
        life: 3000,
      });
      this.navegar.navigate(['/admin/convocatorias/ver-convocatorias']);
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: `se presento un error :C ${error.error.message}`,
        life: 3000,
      });
      throw error;
    }
  }

  tipoDeAccion() {
    if (this.isEditar()) {
      this.editarConvocatoria();
    } else {
      this.onSubmit();
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
        this.tipoDeAccion();
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
  continuarProgreso() {
    this.nuevaConvocatoria();
    const convocatoria = this.convocatoria();
    if (convocatoria) {
      this.convocatoriaId.set(convocatoria.id!);
      this.navegar.navigate(['/grupos/crear-grupos'], {
        queryParams: { convocatoria: convocatoria.id },
      });
    }
  }
  crearGrupo() {
    const convocatoria = this.getConvocatoria.data()?.data;
    if (convocatoria) {
      this.navegar.navigate(['/admin/grupos/crear-grupos'], {
        queryParams: { convocatoria: convocatoria.id },
      });
    }
  }

  accionActualizarTipo(nombre: string, id: string) {
    switch (nombre) {
      case 'publicar':
        this.publicarConvocatoria(id);
        break;
      case 'cancelar':
        this.cancelarConvocatoria(id);
        break;
      case 'cerrar':
        this.cerrarConvocatoria(id);
        break;
    }
  }
  async cancelarConvocatoria(id: string) {
    try {
      const response = await this.convocatoriaStore.cancelConvocatoria(id);
      if (!response) throw Error;
      this.messageService.add({
        severity: 'info',
        summary: 'Confirmar',
        detail: 'Se cancelo con Exito :D',
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: 'Algo ha salido mal, por favor intenta mas tarde :C',
        life: 3000,
      });

      throw error;
    }
  }
  async cerrarConvocatoria(id: string) {
    try {
      const response = await this.convocatoriaStore.closeConvocatoria(id);
      if (!response) throw Error;
      this.messageService.add({
        severity: 'info',
        summary: 'Confirmar',
        detail: 'Se cancelo con Exito :D',
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: 'Algo ha salido mal, por favor intenta mas tarde :C',
        life: 3000,
      });

      throw error;
    }
  }
  async publicarConvocatoria(id: string) {
    try {
      const response = await this.convocatoriaStore.publishConvocatoria(id);
      if (!response) throw Error;
      this.messageService.add({
        severity: 'info',
        summary: 'Confirmar',
        detail: 'Se Publico con Exito :D',
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: 'Algo ha salido mal, por favor intenta mas tarde :C',
        life: 3000,
      });

      throw error;
    }
  }
  private async editarFechas() {
    try {
      const fechas = this.formularioFechasEditado();
      console.log('se va a mandar: ', fechas);
      const response = await this.convocatoriaStore.updateEnrollmentDates(
        this.convocatoriaId(),
        fechas.enrollmentStartDate,
        fechas.enrollmentEndDate
      );
      if (!response) throw Error;
      this.messageService.add({
        severity: 'success',
        summary: 'Rejected',
        detail: `se Edito Con exito! :D`,
        life: 3000,
      });
      this.navegar.navigate(['/admin/convocatorias/ver-convocatorias']);
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: `se presento un error :C ${error.error.message}`,
        life: 3000,
      });
      throw error;
    }
  }

  confirmarEdicionFechas() {
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
        this.editarFechas();
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
