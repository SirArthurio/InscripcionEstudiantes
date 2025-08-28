import { Component, effect, inject, signal } from '@angular/core';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { programs } from '@core/shared/types/programas.type';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { TableComponent } from '@core/shared/components/table/table.component';
import { competenciaStore } from '../../store/competencia.store';
import { filtroTextCompetencias } from '../../const/filtro-text-competencia.const';
import { FiltroService } from '@core/shared/components/filtro/filtro.service';
import { statusCompetencia } from '@core/shared/enums/status-competencia-type.enum copy';

@Component({
  selector: 'app-ver-programas',
  imports: [TableComponent],
  templateUrl: './ver-competencias.component.html',
  styleUrl: './ver-competencias.component.scss',
})
export default class VerProgramasComponent {
  //servicios
  filtroService = inject(FiltroService);
  paginationService = inject(PaginationService);
  //store
  competenciaStore = inject(competenciaStore);
  //variables
  competencias = signal<programs[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  filtroCompetencias = filtroTextCompetencias;
  status = signal<statusCompetencia>(statusCompetencia.activo);
  obtenerPaginaActual = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });

  obtenerStatusActual = effect(() => {
    const status = this.filtroService.currentFiltro();
    if (status) {
      this.status.set(status as statusCompetencia);
    }
  });

  obtenerCompetencias = injectQuery(() => ({
    queryKey: ['competencias', this.status(), this.currentPage()],
    queryFn: async () => {
      try {
        const response = await this.competenciaStore.getCompetencias(
          this.currentPage(),
          this.status()
        );
        this.totalPages.set(response.data.metadata?.totalPages!);
        this.competencias.set(response.data.page);
        return response;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));
}
