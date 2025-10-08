import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { grupo } from '../../model/grupo.type';
import { CommonModule } from '@angular/common';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { cursosStore } from '../../../cursos/store/cursos.store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { statusCursos } from '@core/shared/enums/status-cursos-type.enum';
import { cursoDto } from '../../../cursos/models/cursoDto.type';
import { competenciaDto } from '../../../competencias/model/competenciaDto.type';
import { DialogModule } from 'primeng/dialog';
import { competenciaStore } from '../../../competencias/store/competencia.store';
import { statusCompetencia } from '@core/shared/enums/status-competencia-type.enum';
import { GrupoStore } from '../../store/grupo.store';
import { ActivatedRoute } from '@angular/router';
import { grupoDto } from '../../model/grupoDto.type';

@Component({
  selector: 'app-escoger-curso',
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './escoger-curso.component.html',
  styleUrl: './escoger-curso.component.scss',
})
export class EscogerCursoComponent implements OnInit, OnDestroy {
  //servicios
  paginationService = inject(PaginationService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  router = inject(ActivatedRoute);
  //store
  grupoStore = inject(GrupoStore);
  cursoStore = inject(cursosStore);
  competenciaStore = inject(competenciaStore);
  //signal
  currentPage = signal(1);
  cursos = signal<cursoDto[]>([]);
  grupoSeleccionado = signal<grupoDto | null>(null);
  mostrarModalGrupo = signal<boolean>(false);
  cursoParaAgregar = signal<cursoDto | null>(null);
  //outputs
  @Output() onAgregarCursoAGrupo = new EventEmitter<{
    curso: cursoDto;
  }>();
  //inputs
  idConvocatoria = signal<string>('');
  competencias: competenciaDto[] = [];
  // Signals para manejo de estado
  competenciaSeleccionada = signal<competenciaDto | null>(null);

  ngOnInit() {
    console.log('idConvocatoriaBusqueda', this.idConvocatoria());
  }

  ngOnDestroy(): void {
    this.competenciaStore.resetCompetencias();
    this.grupoStore.resetConvocatoriaId();
    this.grupoStore.resetGrupo();
  }
  obtenerIdConvocatoria() {
    const id = this.router.snapshot.queryParamMap.get('convocatoriaId');
    if (id) {
      this.grupoStore.setConvocatoriaId(id);
      this.idConvocatoria.set(id);
    }
  }

  obtenerPaginaActual = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });

  obtenerCurso = injectQuery(() => ({
    queryKey: ['curso', 'convocatoria', this.idConvocatoria()],
    queryFn: async () => {
      try {
        const response = await this.cursoStore.getCursos(
          1,
          statusCursos.activo
        );
        this.cursos.set(response.data.page);
        console.log(this.cursos());
        return response;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));

  setCompetencias = effect(() => {
    const competencias = this.obtenerCompetencias.data()?.data;
    if (competencias) {
      this.competenciaStore.setCompetencias(competencias);
    }
  });

  obtenerCompetencias = injectQuery(() => ({
    queryKey: ['competencias', 'elegir'],
    queryFn: async () => {
      try {
        const response = await this.competenciaStore.getCompetencias(
          1,
          statusCompetencia.activo
        );
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
  }));

  // Computed properties

  // Métodos

  abrirModalGrupo(curso: cursoDto, event?: Event) {
    this.cursoParaAgregar.set(null);
    this.cursoParaAgregar.set(curso);
    this.grupoStore.resetCursoId();
    this.grupoStore.setCursoId(curso.id!);
    this.confirm1(event ?? new Event('click'), curso);
  }

  cerrarModalGrupo() {
    this.mostrarModalGrupo.set(false);
    this.cursoParaAgregar.set(null);
    this.grupoSeleccionado.set(null);
  }

  crearGrupo() {
    const curso = this.cursoParaAgregar();

    if (curso) {
      this.onAgregarCursoAGrupo.emit({ curso });
    }
    this.confirmationService.close();
  }

  seleccionarGrupo(grupo: grupoDto) {
    this.grupoSeleccionado.set(null);
    this.grupoSeleccionado.set(grupo);
  }
  confirm1(event: Event, curso: cursoDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: ` Quieres agregar el curso ${curso.name} al grupo?`,
      header: 'Confirmacion',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Agregar',
      },
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: 'Lo haz agregado!',
        });
        this.crearGrupo();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Casi',
          detail: 'Casi lo agregas, estuvo cerca',
          life: 3000,
        });
        this.confirmationService.close();
      },
    });
  }
  // Métodos
  seleccionarCompetencia(competencia: competenciaDto) {
    console.log('competencia seleccionada: ', competencia);
    this.grupoStore.setCompetenciaId(competencia.id!);
    this.competenciaSeleccionada.set(competencia);
  }

  seleccionarCurso(curso: competenciaDto) {
    console.log('curso seleccionada: ', curso);
    this.grupoStore.resetCursoId();
    this.grupoStore.setCursoId(curso.id!);
  }
}
