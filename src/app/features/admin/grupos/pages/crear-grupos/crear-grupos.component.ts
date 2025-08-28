import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
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
import { CardFormularioValidacionComponent } from '@core/shared/components/card-formulario-validacion/card-formulario-validacion.component';
import { CartaComponent } from '@core/shared/components/carta/carta.component';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { EscogerCursoComponent } from '../../components/escoger-curso/escoger-curso.component';
import { InputText } from 'primeng/inputtext';
import { GrupoStore } from '../../store/grupo.store';
import { datosGrupoVerificacion } from '../../const/datos-grupo-verificacion';
import { grupo } from '../../model/grupo.type';
import { curso } from '../../../cursos/models/curso.type';
import { modalidad } from '../../../convocatorias/const/modalidad.const';
import { professor } from '@core/shared/types';
import { professorStore } from 'src/app/features/professor/store/professor.store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { dataCrearGrupo } from '../../const/data-crear-grupo.const';
import { dataVerGrupo } from '../../const/data-ver-grupo.const';

@Component({
  selector: 'app-crear-grupos',
  imports: [
    CardFormularioValidacionComponent,
    CartaComponent,
    ReactiveFormsModule,
    CommonModule,
    ConfirmDialogModule,
    ButtonModule,
    Select,
    EscogerCursoComponent,
    InputText,
  ],
  templateUrl: './crear-grupos.component.html',
  styleUrl: './crear-grupos.component.scss',
})
export default class CrearGruposComponent implements OnInit {
  //service
  alertasService = inject(AlertasService);
  erroresFormService = inject(ErroesformService);
  dateFormatterService = inject(DateFormatterService);

  //signals
  validacionData = signal<datosResumen[] | []>([]);
  progress = signal<number>(0);
  modalidades = modalidad;
  profesores = signal<professor[]>([]);
  //formulario
  form = inject(FormBuilder);
  formGrupos!: FormGroup;

  //injecciones
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  grupoStore = inject(GrupoStore);
  professorStore = inject(professorStore);
  router = inject(ActivatedRoute);

  //variables
  isEditar = signal(false);
  datos = signal<CardFormularioValidacion>(dataCrearGrupo);
  minDate: Date = new Date();
  curso = signal<curso | null>(null);
  idConvocatoria = signal<string>('');
  idGrupo = signal<string>('');
  currentPage = signal(1);
  grupo = signal<grupo | null>(null);

  ngOnInit(): void {
    this.formularioGrupo();
    this.obtenerIdConvocatoria();
    this.obtenerIdGrupo();
  }
  ngOnDestroy(): void {
    this.isEditar.set(false);
    this.grupoStore.resetGrupo();
  }
  obtenerIdConvocatoria() {
    const id = this.router.snapshot.queryParamMap.get('convocatoria');
    if (id) {
      this.idConvocatoria.set(id);
      this.formGrupos.get('callId')?.setValue(this.idConvocatoria());
    }
  }
  obtenerIdGrupo() {
    const id = this.router.snapshot.queryParamMap.get('id');
    if (id) {
      this.idGrupo.set(id);
      this.isEditar.set(true);
      this.datos.set(dataVerGrupo);
      console.log('id grupo', this.idGrupo());
    }
  }

  obtenerProfessor = injectQuery(() => ({
    queryKey: ['professors', 'grupos', this.currentPage()],
    queryFn: async () => {
      try {
        const response = await this.professorStore.getProfessor(1, '');
        if (!response) {
          throw Error;
        }
        this.profesores.set(response.data.page);
        return response;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));
  obtenerGrupo = injectQuery(() => ({
    queryKey: ['professors', 'grupos', this.idGrupo()],
    queryFn: async () => {
      try {
        const response = await this.grupoStore.getGrupo(this.idGrupo());
        if (!response) {
          throw Error;
        }
        this.grupo.set(response.data);
        this.setGrupo();
        return response;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));

  siguiente() {
    if (this.progress() < 1) {
      this.progress.update((current) => current + 1);
    }
  }
  setGrupo() {
    this.formGrupos.patchValue(this.grupo()!);
  }

  formularioGrupo() {
    this.formGrupos = this.form.group({
      code: ['', [Validators.required]],
      modality: ['', [Validators.required]],
      courseId: ['', [Validators.required]],
      observations: ['', [Validators.required]],
      professorId: ['', [Validators.required]],
      callId: ['', [Validators.required]],
    });
  }

  nuevoGrupo() {
    this.formGrupos.reset();
    this.progress.set(0);
  }

  resumenDatos(grupo: grupo) {
    this.validacionData.set(datosGrupoVerificacion(grupo));
    this.alertasService.showSuccess(
      'Registrado!',
      'Se registro la convocatoria :D'
    );
    this.siguiente();
  }

  async enviarDatos(grupo: grupo) {
    try {
      const response = await this.grupoStore.createGrupo(grupo);
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
    this.erroresFormService.marcarFormularioError(this.formGrupos);
    this.alertasService.showErrors(
      this.erroresFormService.mostrarErroresFormulario(this.formGrupos)
    );
  }

  onSubmit() {
    if (this.curso() && this.idConvocatoria()) {
      this.formGrupos.get('callId')?.setValue(this.idConvocatoria());
      this.formGrupos.get('courseId')?.setValue(this.curso()?.id);
    }
    console.log('valor: ', this.formGrupos.value);

    if (this.formGrupos.invalid) {
      this.erroresForm();
    } else {
      this.enviarDatos(this.formGrupos.value);
    }
  }

  tipoDeAccion() {
    if (this.isEditar()) {
      this.isEditar();
    } else {
      this.confirm1();
    }
  }
  respuestaCursoAGrupo(event: { curso: curso }) {
    this.curso.set(event.curso);

    if (this.curso() && this.idConvocatoria()) {
      this.formGrupos.get('courseId')?.setValue(this.curso()?.id);
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
        this.confirmationService.close();
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
  agregarHorario() {}
}
