import { Component, effect, inject, signal } from '@angular/core';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { TableComponent } from '@core/shared/components/table/table.component';
import { facultadStore } from '../../store/facultad.store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { facultie } from '../../model/facultie.type';

@Component({
  selector: 'app-ver-facultades',
  imports: [TableComponent],
  templateUrl: './ver-facultades.component.html',
  styleUrl: './ver-facultades.component.scss',
})
export default class VerFacultadesComponent {
  //servicios
  paginationService = inject(PaginationService);
  //store
  facultadStore = inject(facultadStore);
  //variables
  facultades = signal<facultie[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);

  obtenerPaginaActual = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });

  obtenerFacultades = injectQuery(() => ({
    queryKey: ['facultades', this.currentPage()],
    queryFn: async () => {
      try {
        const response = await this.facultadStore.getFacultades(
          this.currentPage(),
          ''
        );
        this.facultadStore.setFacultades(response.data.page);
        this.totalPages.set(response.data.metadata?.totalPages!);
        this.facultades.set(response.data.page);
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));
}
