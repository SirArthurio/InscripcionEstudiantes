import {
  Component,
  OnDestroy,
  OnInit,
  signal,
  inject,
  effect,
} from '@angular/core';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { PaginatedData, professor } from '@core/shared/types';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { professorStore } from 'src/app/features/professor/store/professor.store';
import { TableComponent } from '@core/shared/components/table/table.component';
import { textVerConvocatorias } from '../../../convocatorias/pages/ver-convocatorias/const/textVerConvocatorias.const';

@Component({
  selector: 'app-ver-convocatorias',
  imports: [TableComponent],
  templateUrl: './ver-professor.component.html',
  styleUrl: './ver-professor.component.scss',
})
export default class VerProfessorComponent implements OnDestroy, OnInit {
  totalPaginas = signal<number>(1);
  professors = signal<professor[]>([]);
  //store
  professorStore = inject(professorStore);
  //service
  alertaService = inject(AlertasService);
  paginatedService = inject(PaginationService);
  pagina = signal<number>(1);
  text = textVerConvocatorias;
  ngOnInit(): void {
    this.paginatedService.reset();
  }

  setProfessor = effect(() => {
    const response = this.getProfessors.data();
    if (response) {
      this.professors.set(response.page);
      this.totalPaginas.set(response.metadata?.totalPages!);
    } else this.professors.set([]);
  });
  getProfessors = injectQuery(() => ({
    queryKey: ['professor', this.pagina()],

    queryFn: async (): Promise<PaginatedData<professor[]>> => {
      const response = await this.professorStore.getProfessor(
        this.pagina(),
        ''
      );
      if (!response) throw Error;
      return response.data;
    },
    staleTime: 1000 * 60,
  }));
  getPagina = effect(() => {
    this.pagina.set(this.paginatedService.currentPage());
  });
  ngOnDestroy(): void {
    this.paginatedService.reset();
  }
}
