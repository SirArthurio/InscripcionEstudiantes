import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { grupo } from '../../model/grupo.type';
import { curso } from '../../../cursos/models/curso.type';
import { competencias } from '../../../competencias/model/competencias.type';
import { CommonModule } from '@angular/common';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { competenciaStore } from '../../../competencias/store/competencia.store';
import { cursosStore } from '../../../cursos/store/cursos.store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { convocatoriasStore } from '../../../convocatorias/store/convocatorias.store';
import { convocatoriaDTO } from '../../../convocatorias/model/convocatoriaDTO.type';
import { CartaComponent } from '@core/shared/components/carta/carta.component';
import { statusConvocatorias } from '@core/shared/enums/status-convocatorias-type.enum copy';
import { statusCursos } from '@core/shared/enums/status-cursos-type.enum';
import { cursoDto } from '../../../cursos/models/cursoDto.type';

@Component({
  selector: 'app-escoger-curso',
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
    CartaComponent,
  ],
  templateUrl: './escoger-curso.component.html',
  styleUrl: './escoger-curso.component.scss',
})
export class EscogerCursoComponent implements OnInit {
  //servicios
  paginationService = inject(PaginationService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  //store
  cursoStore = inject(cursosStore);
  //signal
  currentPage = signal(1);
  cursos = signal<cursoDto[]>([]);
  grupoSeleccionado = signal<grupo | null>(null);
  mostrarModalGrupo = signal<boolean>(false);
  cursoParaAgregar = signal<cursoDto | null>(null);
  //outputs
  @Output() onAgregarCursoAGrupo = new EventEmitter<{
    curso: cursoDto;
  }>();
  //inputs
  idConvocatoria = input<string>('');

  ngOnInit() {
    console.log('idConvocatoriaBusqueda', this.idConvocatoria());
  }
  obtenerPaginaActual = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });

  obtenerCurso = injectQuery(() => ({
    queryKey: ['curso', 'grupo', this.idConvocatoria()],
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

  // Computed properties

  // Métodos

  abrirModalGrupo(curso: cursoDto, event?: Event) {
    this.cursoParaAgregar.set(curso);
    this.confirm1(event ?? new Event('click'), curso);
  }

  cerrarModalGrupo() {
    this.mostrarModalGrupo.set(false);
    this.cursoParaAgregar.set(null);
    this.grupoSeleccionado.set(null);
  }

  confirmarAgregarCurso() {
    const curso = this.cursoParaAgregar();

    if (curso) {
      this.onAgregarCursoAGrupo.emit({ curso });
    }
    this.confirmationService.close();
  }

  seleccionarGrupo(grupo: grupo) {
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
        this.confirmarAgregarCurso();
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
}
