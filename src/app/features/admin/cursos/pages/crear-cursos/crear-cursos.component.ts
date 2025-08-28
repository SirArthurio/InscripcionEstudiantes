import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardFormularioValidacion } from '@core/shared/components/card-formulario-validacion/model/cardFormValidacion.type';
import { datosResumen } from '@core/shared/components/card-formulario-validacion/model/datosResumen.type';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { DateFormatterService } from '@core/shared/service/DateFormatter/date-formatter.service';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { datosProgramaVerificacion } from '../../../programas/const/datosProgramasVerificacion';
import { cursosStore } from '../../store/cursos.store';
import { curso } from '../../models/curso.type';
import { CardFormularioValidacionComponent } from '@core/shared/components/card-formulario-validacion/card-formulario-validacion.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CartaComponent } from '@core/shared/components/carta/carta.component';
import { SoloNumerosDirective } from '@core/directives/solo-numeros.directive';
import { InputText } from 'primeng/inputtext';
import { dataCrearCurso } from '../../const/data-crear-curso.const';
import { dataVerCurso } from '../../const/data-ver-curso.const';
import { cursoDto } from '../../models/cursoDto.type';
import { statusCursos } from '@core/shared/enums/status-cursos-type.enum';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-crear-cursos',
  imports: [
    CardFormularioValidacionComponent,
    ConfirmDialogModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    CartaComponent,
    SoloNumerosDirective,
    InputText,
    Toast,
  ],
  templateUrl: './crear-cursos.component.html',
  styleUrl: './crear-cursos.component.scss',
})
export default class CrearCursosComponent {
  //service
  alertasService = inject(AlertasService);
  erroresFormService = inject(ErroesformService);
  dateFormatterService = inject(DateFormatterService);

  //signals
  validacionData = signal<datosResumen[] | []>([]);
  progress = signal<number>(0);

  //formulario
  form = inject(FormBuilder);
  formCurso!: FormGroup;

  //injecciones
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  cursoStore = inject(cursosStore);
  router = inject(ActivatedRoute);

  //variables
  isEditar = signal(false);
  datos = signal<CardFormularioValidacion>(dataCrearCurso);
  minDate: Date = new Date();
  idCompetencia = signal<string>('');
  idCurso = signal<string>('');
  curso = signal<cursoDto | null>(null);
  textAccionArchivarActivar = signal(false);

  ngOnInit(): void {
    this.formularioCurso();
    this.obtenerIdCompetencia();
    this.obtenerIdCurso();
  }
  ngOnDestroy(): void {
    this.cursoStore.resetCursos();
  }
  private obtenerIdCompetencia() {
    const id = this.router.snapshot.queryParamMap.get('competencia');
    if (id) {
      this.idCompetencia.set(id);
    }
  }
  private obtenerIdCurso() {
    const id = this.router.snapshot.queryParamMap.get('id');
    if (id) {
      this.idCurso.set(id);
      console.log(id);
    }
  }

  getCurso = effect(async () => {
    const response = await this.cursoStore.getCurso(this.idCurso());
    if (response) {
      this.formCurso.patchValue(response.data);
      this.isEditar.set(true);
      this.curso.set(response.data);
      this.datos.set(dataVerCurso);
    } else {
      this.isEditar.set(false);
      this.datos.set(dataCrearCurso);
    }
  });

  siguiente() {
    if (this.progress() < 1) {
      this.progress.update((current) => current + 1);
    }
  }

  formularioCurso() {
    this.formCurso = this.form.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      credits: [0, [Validators.required]],
      weeklyHours: [0, [Validators.required]],
      competencyId: [this.idCompetencia()],
    });
  }

  activarOArchivar = effect(() => {
    if (this.curso()?.status == statusCursos.activo) {
      this.textAccionArchivarActivar.set(false);
    } else {
      this.textAccionArchivarActivar.set(true);
    }
  });

  nuevoCurso() {
    this.formCurso.reset();
    this.progress.set(0);
  }

  resumenDatos(curso: curso) {
    this.validacionData.set(datosProgramaVerificacion(curso));
    this.alertasService.showSuccess(
      'Registrado!',
      'Se registro la convocatoria :D'
    );
    this.siguiente();
  }

  async enviarDatos(curso: curso) {
    try {
      console.log('curso', curso);
      const response = await this.cursoStore.createCurso(curso);
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
    this.erroresFormService.marcarFormularioError(this.formCurso);
    this.alertasService.showErrors(
      this.erroresFormService.mostrarErroresFormulario(this.formCurso)
    );
  }

  onSubmit() {
    if (this.formCurso.invalid) {
      this.erroresForm();
    } else {
      this.arregloDeTipadoDatos();
      console.log('formulario', this.formCurso.value);
      this.enviarDatos(this.formCurso.value);
    }
  }
  arregloDeTipadoDatos() {
    this.formCurso.get('competencyId')?.setValue(this.idCompetencia());

    const credits = parseInt(this.formCurso.get('credits')?.value, 10);
    this.formCurso.get('credits')?.setValue(credits);

    const weeklyHours = parseInt(this.formCurso.get('weeklyHours')?.value, 10);
    this.formCurso.get('weeklyHours')?.setValue(weeklyHours);
  }

  tipoDeAccion() {
    if (this.isEditar()) {
      this.isEditar();
      console.log('editar');
    } else {
      this.confirm1();
    }
  }
  archivarOActivar() {
    if (this.curso()?.status != statusCursos.activo) {
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
      const response = await this.cursoStore.activarCurso(this.idCurso());
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
      const response = await this.cursoStore.archivarCurso(this.idCurso());
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
  salir() {}

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
