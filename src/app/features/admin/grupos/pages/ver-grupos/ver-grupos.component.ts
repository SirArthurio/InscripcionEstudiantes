import { Component, effect, inject, signal } from '@angular/core';
import { TableComponent } from '@core/shared/components/table/table.component';
import { GrupoStore } from '../../store/grupo.store';
import { grupo } from '../../model/grupo.type';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-ver-grupos',
  imports: [TableComponent],
  templateUrl: './ver-grupos.component.html',
  styleUrl: './ver-grupos.component.scss',
})
export default class VerGruposComponent {
  //servicios
  paginationService = inject(PaginationService);
  //store
  grupoStore = inject(GrupoStore);
  //variables
  grupos = signal<grupo[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);

  obtenerPaginaActual = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });

  obtenerGrupos = injectQuery(() => ({
    queryKey: ['competencias', this.currentPage()],
    queryFn: async () => {
      try {
        const response = await this.grupoStore.getGrupos(
          this.currentPage(),
          ''
        );
        this.totalPages.set(response.data.metadata?.totalPages!);
        this.grupos.set(response.data.page);
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));
}
