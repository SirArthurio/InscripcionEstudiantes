import { Component, effect, inject, signal } from '@angular/core';
import { TableComponent } from '@core/shared/components/table/table.component';
import { cursosStore } from '../../store/cursos.store';
import { curso } from '../../models/curso.type';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-ver-cursos',
  imports: [TableComponent],
  templateUrl: './ver-cursos.component.html',
  styleUrl: './ver-cursos.component.scss',
})
export default class VerCursosComponent {
  //servicios
  paginationService = inject(PaginationService);
  //store
  cursoStore = inject(cursosStore);
  //variables
  cursos = signal<curso[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);

  obtenerPaginaActual = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });

  obtenerProgramas = injectQuery(() => ({
    queryKey: ['cursos', this.currentPage()],
    queryFn: async () => {
      try {
        const response = await this.cursoStore.getCursos();
        this.totalPages.set(response.data.metadata?.totalPages!);
        this.cursos.set(response.data.page);
        console.log(this.cursos());
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));
}
