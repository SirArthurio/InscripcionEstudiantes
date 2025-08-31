import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '@core/shared/components/table/table.component';
import { cursosStore } from '../../store/cursos.store';
import { curso } from '../../models/curso.type';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { statusCursos } from '@core/shared/enums/status-cursos-type.enum';
import { FiltroService } from '@core/shared/components/filtro/filtro.service';
import { filtroTextCurso } from '../../const/filtro-text-curso.const';
import { cursoDto } from '../../models/cursoDto.type';

@Component({
  selector: 'app-ver-cursos',
  imports: [TableComponent],
  templateUrl: './ver-cursos.component.html',
  styleUrl: './ver-cursos.component.scss',
})
export default class VerCursosComponent implements OnInit {
  //servicios
  paginationService = inject(PaginationService);
  router = inject(ActivatedRoute);
  filtroService = inject(FiltroService);
  //store
  cursoStore = inject(cursosStore);
  //variables
  cursos = signal<cursoDto[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  competenciaId = signal('');
  status = signal<statusCursos>(statusCursos.activo);
  filtroCurso = filtroTextCurso;

  ngOnInit() {
    this.obtenerIdCompetencia();
  }

  obtenerIdCompetencia() {
    const id = this.router.snapshot.queryParamMap.get('competencyId');
    if (id) {
      this.competenciaId.set(id);
    }
  }
  obtenerPaginaActual = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });
  getStatus = effect(() => {
    const status = this.filtroService.currentFiltro();
    if (status !== '') {
      this.status.set(status as statusCursos);
    }
  });

  obtenerCursos = injectQuery(() => ({
    queryKey: ['cursos', this.status(), this.currentPage()],
    queryFn: async () => {
      try {
        console.log('status', this.status());
        const response = await this.cursoStore.getCursosCompetencia(
          this.currentPage(),
          this.status(),
          this.competenciaId()
        );
        this.totalPages.set(response.data.metadata?.totalPages!);
        this.cursos.set(response.data.page);
        console.log(this.cursos());
        return response;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));
}
