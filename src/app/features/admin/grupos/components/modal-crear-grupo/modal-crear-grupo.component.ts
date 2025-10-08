import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardFormularioValidacion } from '@core/shared/components/card-formulario-validacion/model/cardFormValidacion.type';
import { CartaComponent } from '@core/shared/components/carta/carta.component';
import { SchedulesComponent } from '@core/shared/components/schedules/schedules.component';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { DateFormatterService } from '@core/shared/service/DateFormatter/date-formatter.service';
import { ErroesformService } from '@core/shared/service/ErroresForm/erroesform.service';
import { professor } from '@core/shared/types';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { professorStore } from 'src/app/features/professor/store/professor.store';
import { modalidad } from '../../../convocatorias/const/modalidad.const';
import { cursoDto } from '../../../cursos/models/cursoDto.type';
import { grupoDto } from '../../model/grupoDto.type';
import { GrupoStore } from '../../store/grupo.store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { dataVerGrupo } from '../../const/data-ver-grupo.const';
import { grupo } from '../../model/grupo.type';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { SoloNumerosDirective } from '@core/directives/solo-numeros.directive';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { cursosStore } from '../../../cursos/store/cursos.store';
import { dataCrearGrupo } from '../../const/data-crear-grupo.const';
import { scheduleStore } from '../../../schedules/store/schedule.store';
import { schedule } from '../../../schedules/model/schedule.type';

@Component({
  selector: 'grupo-modal-crear-grupo',
  imports: [
    DialogModule,
    CartaComponent,
    ReactiveFormsModule,
    CommonModule,
    ConfirmDialogModule,
    ButtonModule,
    Select,
    InputText,
    SchedulesComponent,
    SoloNumerosDirective,
    InputNumberModule,
  ],
  templateUrl: './modal-crear-grupo.component.html',
  styleUrl: './modal-crear-grupo.component.scss',
})
export class ModalCrearGrupoComponent implements OnInit, OnDestroy {
  //childs
  @ViewChild(SchedulesComponent) SchedulesComponent!: SchedulesComponent;
  //service
  erroresFormService = inject(ErroesformService);
  dateFormatterService = inject(DateFormatterService);
  alertasService = inject(AlertasService);
  //formulario
  form = inject(FormBuilder);
  formGrupos!: FormGroup;
  //signals
  progress = signal<number>(0);
  modalidades = modalidad;
  profesores = signal<professor[]>([]);
  schedules = signal<schedule[]>([]);
  datos = signal<CardFormularioValidacion>(dataCrearGrupo);

  //injecciones
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  professorStore = inject(professorStore);
  //variables
  isEditar = signal(false);
  minDate: Date = new Date();
  curso = signal<cursoDto | null>(null);
  currentPage = signal(1);
  grupo = signal<grupoDto | null>(null);
  visibleSchedule = signal(false);

  //inputs
  idCurso = signal<string>('');
  idConvocatoria = signal<string>('');
  idGrupo = signal<string>('          ');
  //outputs
  abrirModal = output();
  cerrarModal = output();
  //store
  cursoStore = inject(cursosStore);
  grupoStore = inject(GrupoStore);
  scheduleStore = inject(scheduleStore);

  ngOnInit(): void {
    this.formularioGrupo();
    this.schedulesForm();
  }
  ngOnDestroy(): void {
    this.scheduleStore.resetSchedule();
  }
  get callId() {
    return this.grupoStore.convocatoriaId();
  }

  get cursoId() {
    return this.grupoStore.cursoId();
  }

  formularioGrupo() {
    this.formGrupos = this.form.group({
      modality: ['', [Validators.required]],
      courseId: ['', [Validators.required]],
      observations: ['', [Validators.required]],
      professorId: ['', [Validators.required]],
      callId: ['', [Validators.required]],
      capacity: ['', [Validators.required]],
      schedules: this.form.array([], [Validators.required]),
    });
  }
  schedulesForm(): FormGroup {
    return this.form.group({
      day: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
    });
  }

  newSchedules = this.form.control('', Validators.required);
  get extension() {
    return this.formGrupos.get('schedules') as FormArray;
  }
  schedulesHijo(schedule: schedule[]) {
    this.extension.clear();
    const id = this.grupoStore.grupo()?.id;
    if (this.isEditar() && id) {
      console.log(
        'ntro a actualizacion con el id: ',
        id,
        'y el horario: ',
        schedule
      );
      this.grupoStore.sincronizarSchedule(id, schedule);
    } else {
      schedule.forEach((element) => {
        element.endTime = DateFormatterService.convertToHHmmss(element.endTime);
        element.startTime = DateFormatterService.convertToHHmmss(
          element.startTime
        );

        this.extension.push(this.form.control(element));
      });
    }

    this.schedules.set(schedule);

    console.log('asi que da el form', this.formGrupos.value);
  }

  nuevoGrupo() {
    this.formGrupos.reset();
    this.progress.set(0);
  }

  resumenDatos() {
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
      this.resumenDatos();
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
    console.log('id curso modal: ', this.cursoId);
    console.log('id convoc modal: ', this.callId);

    if (this.cursoId.length > 0 && this.callId.length > 0) {
      this.formGrupos.get('callId')?.setValue(this.callId);
      this.formGrupos.get('courseId')?.setValue(this.cursoId);
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
  respuestaCursoAGrupo(event: { curso: cursoDto }) {
    this.curso.set(event.curso);

    if (this.curso() && this.idConvocatoria()) {
      this.formGrupos.get('courseId')?.setValue(this.curso()?.id);
    }
  }

  cerrarCalendario() {
    console.log('cerrar');
    this.visibleSchedule.set(false);
  }

  obtenerProfessor = injectQuery(() => ({
    queryKey: ['professors', 'grupos', this.currentPage()],
    queryFn: async () => {
      try {
        const response = await this.professorStore.getProfessors(1, '');
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
  obtenerGrupo = effect(() => {
    const response = this.grupoStore.grupo();
    if (response) {
      this.scheduleStore.setSchedule(response.schedules);
      this.grupo.set(response);
      this.datos.set(dataVerGrupo);
      this.formGrupos.patchValue(response);
      this.formGrupos.get('professorId')?.setValue(response.professor.id!);
      this.isEditar.set(true);
      this.abrirModalPadre();
      console.log('schedules: ', response.schedules);
      console.log('data', response);
    } else {
      this.isEditar.set(false);
      this.datos.set(dataCrearGrupo);
    }
  });
  obtenerHorario = effect(() => {
    const response = this.scheduleStore.schedule();
    if (response) {
      this.schedules.set(response);
    }
  });

  siguiente() {
    if (this.progress() < 1) {
      this.progress.update((current) => current + 1);
    }
    this.cerrarModal.emit();
  }
  // setGrupo = effect(() => {
  //   const grupo = this.obtenerGrupo.data()?.data;
  //   console.log('modal grupo', grupo?.professor.id);
  //   if (grupo !== undefined) {
  //     this.formGrupos.patchValue(grupo);
  //     this.formGrupos.get('professorId')?.setValue(grupo.professor.id!);
  //     console.log('padre: ', this.extension);
  //   }
  // });

  enviarSchedulesPadreAHijo = effect(() => {
    const schedules = this.extension.value;
    this.schedules.set(schedules);
    console.log('asi se ven en el apdre:', schedules);
  });

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
  confirmAbrir() {
    this.confirmationService.confirm({
      message: 'Estas seguro de abrir el grupo?',
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
        label: 'Abrir',
      },
      accept: () => {
        this.abrirGrupo();
        this.confirmationService.close();
      },
      reject: () => {
        this.mensajeCancelar();
      },
    });
  }
  confirmCerrar() {
    this.confirmationService.confirm({
      message: 'Estas seguro de cerrar el grupo?',
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
        label: 'Abrir',
      },
      accept: () => {
        this.cerrarGrupo();
        this.confirmationService.close();
      },
      reject: () => {
        this.mensajeCancelar();
      },
    });
  }
  confirmCancelar() {
    this.confirmationService.confirm({
      message: 'Estas seguro de cancelar el grupo?',
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
        label: 'Abrir',
      },
      accept: () => {
        this.cancelarGrupo();
        this.confirmationService.close();
      },
      reject: () => {
        this.mensajeCancelar();
      },
    });
  }
  agregarHorario() {
    this.visibleSchedule.set(true);
  }
  async abrirGrupo() {
    try {
      const response = await this.grupoStore.abrirGrupo(this.idGrupo());
      if (!response) throw Error;
      this.mensajeOperacionExitosa('abrio');
    } catch (error) {
      this.mensajeError(error);
      throw error;
    }
  }
  async cancelarGrupo() {
    try {
      const response = await this.grupoStore.cancelarGrupo(this.idGrupo());
      if (!response) throw Error;
      this.mensajeOperacionExitosa('cancelo');
    } catch (error) {
      this.mensajeError(error);
      throw error;
    }
  }
  async cerrarGrupo() {
    try {
      const response = await this.grupoStore.cerrarGrupo(this.idGrupo());
      if (!response) throw Error;
      this.mensajeOperacionExitosa('cerro');
    } catch (error) {
      this.mensajeError(error);
      throw error;
    }
  }
  mensajeOperacionExitosa(mensaje: string) {
    this.messageService.add({
      severity: 'succes',
      summary: 'Succes',
      detail: `se ${mensaje} el grupo con exito`,
      life: 3000,
    });
  }
  mensajeCancelar() {
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'Eso estuvo cerca',
      life: 3000,
    });
  }
  mensajeError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: `Por favor intenta mas tarde ${error.error.message}`,
      life: 3000,
    });
  }
  abrirModalPadre() {
    this.abrirModal.emit();
  }
}
