import { Component, effect, inject, signal } from '@angular/core';
import { TableComponent } from '@core/shared/components/table/table.component';
import { programs } from '@core/shared/types/programas.type';
import { ProgramasService } from './service/programas.service';
import { programasStore } from './store/programas.store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';

@Component({
  selector: 'app-programas',
  imports: [TableComponent],
  templateUrl: './programas.component.html',
  styleUrl: './programas.component.scss',
})
export default class ProgramasComponent {
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
        const response = await this.programaStore.getProgramas();
        this.totalPages.set(response.data.metadata?.totalPages!);
        this.programas.set(response.data.page);
      } catch (error) {
        throw error;
      }
    },
  }));
}
