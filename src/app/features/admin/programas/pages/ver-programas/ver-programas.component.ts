import { Component, effect, inject, signal } from '@angular/core';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { programs } from '@core/shared/types/programas.type';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { TableComponent } from '@core/shared/components/table/table.component';
import { programasStore } from '../../store/programas.store';

@Component({
  selector: 'app-ver-programas',
  imports: [TableComponent],
  templateUrl: './ver-programas.component.html',
  styleUrl: './ver-programas.component.scss',
})
export default class VerProgramasComponent {
  //servicios
  paginationService = inject(PaginationService);
  //store
  programaStore = inject(programasStore);
  //variables
  programas = signal<programs[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);

  obtenerPaginaActual = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });

  obtenerProgramas = injectQuery(() => ({
    queryKey: ['programas', this.currentPage()],
    queryFn: async () => {
      try {
        const response = await this.programaStore.getProgramas(
          this.currentPage()
        );
        if (!response) throw Error;
        this.totalPages.set(response.data.metadata?.totalPages!);
        this.programas.set(response.data.page);
        return response;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));
}
