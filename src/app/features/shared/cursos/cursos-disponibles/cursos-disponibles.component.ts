import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { textCrusosDisponibles } from './const/text.cursos-disponibles';
import { StatusService } from '../../../../core/shared/service/status/status.service';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GrupoStore } from 'src/app/features/admin/grupos/store/grupo.store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { grupoDto } from 'src/app/features/admin/grupos/model/grupoDto.type';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CurrentStore } from 'src/app/features/auth/store/current.store';
import { EnrollmentStore } from '../../enrollment/store/enrollment.store';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NoDataComponent } from "@core/shared/components/no-data/no-data.component";
import CargandoComponent from "@core/shared/components/cargando/cargando.component";
import { competenciaStore } from 'src/app/features/admin/competencias/store/competencia.store';
import { competenciaDto } from 'src/app/features/admin/competencias/model/competenciaDto.type';
import { TabViewModule } from 'primeng/tabview';
import { noInfo } from "../../no-info/no-info.component";

@Component({
  selector: 'app-cursos-disponibles',
  imports: [
    TagModule,
    ButtonModule,
    TitleCasePipe,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    NoDataComponent,
    noInfo,
    CommonModule,
    TabViewModule,
    CargandoComponent
  ],
  templateUrl: './cursos-disponibles.component.html',
  styleUrl: './cursos-disponibles.component.scss',
})
export class CursosDisponiblesComponent implements OnInit {
  //stores
  grupoStore = inject(GrupoStore);
  authStore = inject(CurrentStore);
  enrollmentStore = inject(EnrollmentStore);
  competenciaStore = inject(competenciaStore);

  //injecciones
  router = inject(ActivatedRoute);
  navegar = inject(Router);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  //servicios
  statusService = inject(StatusService);
  paginationService = inject(PaginationService);

  //signals
  gruposDisponibles = signal<grupoDto[]>([]);
  competencias = signal<competenciaDto[]>([]);
  texto = textCrusosDisponibles;
  convocatoriaId = signal<string>('');
  currentPage = signal<number>(1);
  competenciaSeleccionada = signal<string | null>(null);

  ngOnInit(): void {
    // Escuchar el cambio en los queryParams
    this.router.queryParams.subscribe(params => {
      if (params['convocatoriaId']) {
        this.convocatoriaId.set(params['convocatoriaId']);
        console.log('convocatoriaId actualizado:', params['convocatoriaId']);
      }
    });
  }

  obtenerPaginaActual = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });

  filtrarGrupos(grupos: grupoDto[]): grupoDto[] {
    return grupos.filter((e) => e.status == 'abierto');
  }

  // query para competencias
  // obtenerCompetencias = injectQuery(() => ({
  //   queryKey: ['competencias', this.convocatoriaId()],
  //   queryFn: async () => {
  //     if (!this.convocatoriaId()) return [];
  //     const response = await this.competenciaStore.getCompetenciasPorConvocatoria(
  //       this.convocatoriaId()
  //     );
  //     this.competencias.set(response.data);
  //     return response.data;
  //   },
  //   enabled: () => !!this.convocatoriaId(),
  //   staleTime: 10 * 60,
  // }));


  obtenerGrupos = injectQuery(() => ({
  queryKey: ['grupos', this.convocatoriaId(), this.currentPage()],
  queryFn: async () => {
    if (!this.convocatoriaId()) {
      console.log('[No hay convocatoriaId');
      return [];
    }
    console.log('Llamando grupos con convocatoriaId:', this.convocatoriaId());

    const response = await this.grupoStore.getGruposPorConvocatoriaStudent(
      this.convocatoriaId()
    );

    console.log('Respuesta grupos:', response);

    const grupos = Array.isArray(response.data) ? response.data : [];
    const filtrados = grupos.filter((g) => g.status === 'preliminar' || g.status === 'activo');

    console.log('Grupos filtrados:', filtrados);

    // Extraer competencias únicas de los cursos
    const competenciasUnicas = new Map<string, competenciaDto>();
    filtrados.forEach(grupo => {
      if (grupo.course?.competency) {
        competenciasUnicas.set(grupo.course.competency.id!, grupo.course.competency);
      }
    });
    
    const competenciasArray = Array.from(competenciasUnicas.values());
    this.competencias.set(competenciasArray);
    console.log('Competencias extraídas:', competenciasArray);

    this.gruposDisponibles.set(filtrados);
    return response.data;
  },
  enabled: () => !!this.convocatoriaId(),
  staleTime: 10 * 60,
}));

  seleccionarCompetencia(competenciaId: string): void {
  this.competenciaSeleccionada.set(competenciaId);
  console.log('Competencia seleccionada:', competenciaId);
}

  tieneGruposEnCompetencia(competenciaId: string): boolean {
  return this.gruposDisponibles().some(g => g.course?.competency?.id === competenciaId);
}

  statusColor(status: string): ButtonSeverity {
    return this.statusService.statusColor(status);
  }

  

  // confirmacionMatricula(grupoId: string) {
  //   this.confirmationService.confirm({
  //     message: `¿Estás seguro de matricular este curso?`,
  //     header: 'Confirmation',
  //     closable: true,
  //     closeOnEscape: true,
  //     icon: 'pi pi-exclamation-triangle',
  //     acceptButtonProps: {
  //       label: 'Aceptar',
  //     },
  //     rejectButtonProps: {
  //       label: 'Cancelar',
  //     },
  //     rejectVisible: true,
  //     accept: () => {
  //       this.matricular(grupoId);
  //     },
  //   });
  // }
}
