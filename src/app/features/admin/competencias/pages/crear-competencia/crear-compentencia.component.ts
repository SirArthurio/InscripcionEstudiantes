import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardFormularioValidacionComponent } from '@core/shared/components/card-formulario-validacion/card-formulario-validacion.component';
import { CardFormularioValidacion } from '@core/shared/components/card-formulario-validacion/model/cardFormValidacion.type';
import { datosResumen } from '@core/shared/components/card-formulario-validacion/model/datosResumen.type';
import { CartaComponent } from '@core/shared/components/carta/carta.component';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { DateFormatterService } from '@core/shared/service/DateFormatter/date-formatter.service';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputText } from 'primeng/inputtext';
import { ValidationClassDirective } from '@core/directives/app-validation-class.directive';
import { competenciaStore } from '../../store/competencia.store';
import { datosCompetenciaVerificacion } from '../../const/datosCompetenciaVerificacion';
import { dataCrearCompetencia } from '../../const/data-crearCompetencia.const';
import { dataVerCompetencia } from '../../const/data-verCompetencia.const';
import { competencias } from '../../model/competencias.type';
import { ActivatedRoute, Router } from '@angular/router';
import { competenciaDto } from '../../model/competenciaDto.type';
import { statusCursos } from '@core/shared/enums/status-cursos-type.enum';
import { statusCompetencia } from '@core/shared/enums/status-competencia-type.enum copy';

@Component({
  selector: 'app-crear-facultad',
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
  templateUrl: './crear-compentencia.component.html',
  styleUrl: './crear-compentencia.component.scss',
})
export default class CrearCompentenciaComponent {
  //service
  alertasService = inject(AlertasService);
  erroresFormService = inject(ErroesformService);
  dateFormatterService = inject(DateFormatterService);

  //signals
  validacionData = signal<datosResumen[] | []>([]);
  progress = signal<number>(0);

  //formulario
  form = inject(FormBuilder);
  formCompetencias!: FormGroup;

  //injecciones
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  competenciaStore = inject(competenciaStore);
  router = inject(ActivatedRoute);
  navigate = inject(Router);

  //variables
  isEditar = signal(false);
  datos = signal<CardFormularioValidacion>(dataCrearCompetencia);
  minDate: Date = new Date();
  idCompetencia = signal<string>('');
  competencia = signal<competenciaDto | null>(null);
  textAccionArchivarActivar = signal(false);

  ngOnInit(): void {
    this.formularioCompetencia();
    this.obtenerIdCompetencia();
  }
  ngOnDestroy(): void {
    this.competenciaStore.resetCompetencia();
    this.nuevaCompetencia();
    this.idCompetencia.set('');
    this.formCompetencias.reset();
    this.competencia.set(null);
  }
  activarOArchivar = effect(() => {
    if (this.competencia()?.status == statusCompetencia.activo) {
      this.textAccionArchivarActivar.set(false);
    } else {
      this.textAccionArchivarActivar.set(true);
    }
  });
  getCompetencias = effect(async () => {
    if (this.idCompetencia()) {
      const response = await this.competenciaStore.getCompetencia(
        this.idCompetencia()
      );
      if (response) {
        this.formCompetencias.patchValue(response.data);
        this.isEditar.set(true);
        this.datos.set(dataVerCompetencia);
        this.competencia.set(response.data);
      } else {
        this.isEditar.set(false);
        this.datos.set(dataCrearCompetencia);
      }
    }
  });
  obtenerIdCompetencia() {
    const id = this.router.snapshot.queryParamMap.get('id');
    if (id) {
      this.idCompetencia.set(id);
      console.log('id', this.idCompetencia());
    }
  }

  siguiente() {
    if (this.progress() < 1) {
      this.progress.update((current) => current + 1);
    }
  }

  formularioCompetencia() {
    this.formCompetencias = this.form.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  nuevaCompetencia() {
    this.formCompetencias.reset();
    this.progress.set(0);
  }

  resumenDatos(compentencia: competencias) {
    this.validacionData.set(datosCompetenciaVerificacion(compentencia));
    this.alertasService.showSuccess(
      'Registrado!',
      'Se registro la competencia :D'
    );
    this.siguiente();
  }

  async enviarDatos(competencia: competencias) {
    try {
      const response = await this.competenciaStore.createCompetencia(
        competencia
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
    this.erroresFormService.marcarFormularioError(this.formCompetencias);
    this.alertasService.showErrors(
      this.erroresFormService.mostrarErroresFormulario(this.formCompetencias)
    );
  }

  onSubmit() {
    if (this.formCompetencias.invalid) {
      this.erroresForm();
    } else {
      this.enviarDatos(this.formCompetencias.value);
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
  crearCurso() {
    this.navigate.navigate(['/admin/cursos/crear-cursos'], {
      queryParams: { competencia: this.idCompetencia() },
    });
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
  verCursosCompetencia() {
    this.navigate.navigate(['/admin/cursos/ver-cursos'], {
      queryParams: {
        competencyId: this.idCompetencia(),
      },
    });
  }
  archivarOActivar() {
    if (this.competencia()?.status != statusCursos.activo) {
      this.confirmarActivar();
      console.log('editar');
    } else {
      this.confirmarArchivar();
    }
  }
  confirmarActivar() {
    this.confirmationService.confirm({
      message: 'Estas seguro de Activar?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Activar',
      },
      accept: () => {
        this.activar();
      },
      reject: () => {
        this.cancelarMensaje();
      },
    });
  }
  private async activar() {
    try {
      const response = await this.competenciaStore.activarCompetencia(
        this.idCompetencia()
      );
      if (!response) throw Error;
      this.messageService.add({
        severity: 'succes',
        summary: 'Exito!',
        detail: 'Se Activo con Exito',
        life: 3000,
      });
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: `ha ocurrido un error ${error.error.message}`,
        life: 3000,
      });
      throw error;
    }
  }
  private async archivar() {
    try {
      const response = await this.competenciaStore.archivarCompetencia(
        this.idCompetencia()
      );
      if (!response) throw Error;
      this.messageService.add({
        severity: 'succes',
        summary: 'Exito!',
        detail: 'Se Archivo con Exito',
        life: 3000,
      });
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: `ha ocurrido un error ${error.error.message}`,
        life: 3000,
      });
      throw error;
    }
  }
  confirmarArchivar() {
    this.confirmationService.confirm({
      message: 'Estas seguro de Archivar?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Archivar',
      },
      accept: () => {
        this.archivar();
      },
      reject: () => {
        this.cancelarMensaje();
      },
    });
  }
  cancelarMensaje() {
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'Eso estuvo cerca :D',
      life: 3000,
    });
  }
}
