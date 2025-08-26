import { Component, effect, inject, signal } from '@angular/core';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { programs } from '@core/shared/types/programas.type';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { TableComponent } from '@core/shared/components/table/table.component';
import { competenciaStore } from '../../store/competencia.store';

@Component({
  selector: 'app-ver-programas',
  imports: [TableComponent],
  templateUrl: './ver-competencias.component.html',
  styleUrl: './ver-competencias.component.scss',
})
export default class VerProgramasComponent {
  //servicios
  paginationService = inject(PaginationService);
  //store
  competenciaStore = inject(competenciaStore);
  //variables
  competencias = signal<programs[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);

  obtenerPaginaActual = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });

  obtenerCompetencias = injectQuery(() => ({
    queryKey: ['competencias', this.currentPage()],
    queryFn: async () => {
      try {
        const response = await this.competenciaStore.getCompetencias(
          this.currentPage(),
          ''
        );
        this.totalPages.set(response.data.metadata?.totalPages!);
        this.competencias.set(response.data.page);
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));
}
