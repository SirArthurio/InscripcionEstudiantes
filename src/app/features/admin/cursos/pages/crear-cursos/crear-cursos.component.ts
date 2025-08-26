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
import { dataCrearPrograma } from '../../../programas/const/data-crearPrograma.const';
import { dataVerPrograma } from '../../../programas/const/data-verPrograma.const';
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

  ngOnInit(): void {
    this.formularioCurso();
    this.obtenerIdFacultad();
  }
  ngOnDestroy(): void {
    this.cursoStore.resetCursos();
  }
  private obtenerIdFacultad() {
    const id = this.router.snapshot.queryParamMap.get('facultad');
    if (id) {
      this.idCompetencia.set(id);
    }
  }

  getCurso = effect(() => {
    const response = this.cursoStore.getCursos();
    if (response) {
      this.formCurso.patchValue(response);
      this.isEditar.set(true);
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
      credits: ['', [Validators.required]],
      weeklyHours: ['', [Validators.required]],
      competency: [this.idCompetencia(), [Validators.required]],
    });
  }

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
      const response = await this.cursoStore.createCurso(
        curso,
        this.idCompetencia()
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
    this.erroresFormService.marcarFormularioError(this.formCurso);
    this.alertasService.showErrors(
      this.erroresFormService.mostrarErroresFormulario(this.formCurso)
    );
  }

  onSubmit() {
    if (this.formCurso.invalid) {
      this.erroresForm();
    } else {
      this.enviarDatos(this.formCurso.value);
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
