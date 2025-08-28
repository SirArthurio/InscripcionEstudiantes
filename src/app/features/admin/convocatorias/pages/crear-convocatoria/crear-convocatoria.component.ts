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
import { CardFormularioValidacionComponent } from '../../../../../core/shared/components/card-formulario-validacion/card-formulario-validacion.component';
import { InputTextModule } from 'primeng/inputtext';
import { modalidad } from '../../const/modalidad.const';
import { DatePicker } from 'primeng/datepicker';
import { ErroesformService } from '../../../../../core/shared/service/ErroresForm/erroesform.service';
import { AlertasService } from '../../../../../core/shared/service/Alertas/alertas.service';
import { ButtonModule } from 'primeng/button';
import { DateFormatterService } from '../../../../../core/shared/service/DateFormatter/date-formatter.service';
import { datosResumen } from '../../../../../core/shared/components/card-formulario-validacion/model/datosResumen.type';
import { convocatoria } from '../../model/convocatoria.type';
import { datosConvocatoriaVerificacion } from '../../const/datosConvocatoriaVerificar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { CartaComponent } from '../../../../../core/shared/components/carta/carta.component';
import { HttpErrorResponse } from '@angular/common/http';
import { convocatoriasStore } from '../../store/convocatorias.store';
import { CardFormularioValidacion } from '@core/shared/components/card-formulario-validacion/model/cardFormValidacion.type';
import { dataVerConvocatoria } from '../../const/data-verConvocatoria.const';
import { convocatoriaDTO } from '../../model/convocatoriaDTO.type';
import { editConvocatoria } from '../ver-convocatorias/components/card-generic/model/edit.convocatoria.type';
import { Router } from '@angular/router';
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
  router = inject(Router);

  //variables
  isEditar = signal(false);
  datos = signal<CardFormularioValidacion>(dataCrearConvocatoria);
  modalidades = modalidad;
  minDate: Date = new Date();
  convocatoriaId = signal<string>('');
  convocatoria = signal<convocatoriaDTO | null>(null);

  ngOnInit(): void {
    this.formularioConvocatoria();
  }
  ngOnDestroy(): void {
    this.convocatoriaStore.resetConvocatoria();
  }

  getConvocatoria = effect(() => {
    const response = this.convocatoriaStore.convocatoria();
    if (response) {
      this.setDatos(response);
      this.convocatoriaId.set(response.id!);
      this.isEditar.set(true);
      this.convocatoria.set(response);
      this.datos.set(dataVerConvocatoria);
    } else {
      this.isEditar.set(false);
      this.datos.set(dataCrearConvocatoria);
    }
  });

  setDatos(response: convocatoriaDTO) {
    this.datosOriginales.set(response);
    this.formConvocatoria.patchValue(response);

    const rangeDateClassSet: (Date | null)[] = [
      new Date(response.classStartDate),
      response.classEndDate ? new Date(response.classEndDate) : null,
    ];

    const rangeDatesEnrollmentSet: (Date | null)[] = [
      new Date(response.enrollmentStartDate),
      response.enrollmentEndDate ? new Date(response.enrollmentEndDate) : null,
    ];

    this.formConvocatoria.get('rangeDatesClass')?.setValue(rangeDateClassSet);
    this.formConvocatoria
      .get('rangeDatesEnrollment')
      ?.setValue(rangeDatesEnrollmentSet);

    this.formConvocatoria.get('rangeDatesEnrollment')?.disable();
  }

  siguiente() {
    if (this.progress() < 1) {
      this.progress.update((current) => current + 1);
    }
  }

  formularioConvocatoria() {
    this.formConvocatoria = this.form.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      rangeDatesClass: ['', [Validators.required]],
      classStartDate: ['', [Validators.required]],
      classEndDate: ['', []],
      rangeDatesEnrollment: ['', [Validators.required]],
      enrollmentStartDate: ['', [Validators.required]],
      enrollmentEndDate: ['', [Validators.required]],
    });
  }

  convertirRangoAFechas() {
    const startClass = this.formConvocatoria.get('rangeDatesClass')?.value?.[0];
    const endClass = this.formConvocatoria.get('rangeDatesClass')?.value?.[1];
    const startEnrollment = this.formConvocatoria.get('rangeDatesEnrollment')
      ?.value?.[0];
    const endEnrollment = this.formConvocatoria.get('rangeDatesEnrollment')
      ?.value?.[1];
    if (endClass) {
      this.formConvocatoria.get('classEndDate')?.setValue(endClass);
    }
    this.formConvocatoria.get('classStartDate')?.setValue(startClass);
    this.formConvocatoria.get('enrollmentStartDate')?.setValue(startEnrollment);
    this.formConvocatoria.get('enrollmentEndDate')?.setValue(endEnrollment);
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

  datosEditatos(): editConvocatoria {
    return {
      classStartDate: this.formConvocatoria.value.classStartDate,
      classEndDate: this.formConvocatoria.value.classEndDate,
      code: this.formConvocatoria.value.code,
      name: this.formConvocatoria.value.name,
      description: this.formConvocatoria.value.description,
    };
  }

  formularioEditado(): editConvocatoria {
    const original = (this.datosOriginales() ??
      {}) as Partial<editConvocatoria>;
    const actual = this.datosEditatos();

    const resultado: any = {};

    (Object.keys(actual) as (keyof editConvocatoria)[]).forEach((key) => {
      if (actual[key] !== original[key]) {
        resultado[key] = actual[key];
      } else {
        resultado[key] = null;
      }
    });

    return resultado as editConvocatoria;
  }

  onSubmit() {
    this.convertirRangoAFechas();
    if (this.formConvocatoria.invalid) {
      this.erroresForm();
    } else {
      this.enviarDatos(this.convercionDatos());
    }
  }
  private async editarConvocatoria() {
    try {
      console.log(this.formularioEditado());
      const response =
        await this.convocatoriaStore.updateInformationConvocatoria(
          this.convocatoriaId(),
          this.formularioEditado()
        );
      if (!response) throw Error;
      this.messageService.add({
        severity: 'error',
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
      this.convocatoriaStore.setConvocatoria(convocatoria);
    }
  }
  crearGrupo() {
    const convocatoria = this.convocatoria();
    if (convocatoria) {
      this.router.navigate(['/admin/grupos/crear-grupos'], {
        queryParams: { convocatoria: convocatoria.id },
      });
    }
  }
  verGrupos() {
    const convocatoria = this.convocatoria();
    if (convocatoria) {
      this.router.navigate(['/admin/grupos/ver-grupos'], {
        queryParams: {
          convocatoria: convocatoria.id,
        },
      });
    }
  }
}
