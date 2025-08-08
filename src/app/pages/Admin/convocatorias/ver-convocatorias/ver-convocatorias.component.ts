import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CardGenericComponent } from './components/card-generic/card-generic.component';
import { PaginationComponent } from '@core/shared/components/pagination/pagination.component';
import { textVerConvocatorias } from './const/textVerConvocatorias.const';
import { convocatoriaDTO } from '../crear-convocatoria/model/convocatoriaDTO.type';
import { convocatoriasStore } from '../store/convocatorias.store';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import CargandoComponent from '@core/shared/components/cargando/cargando.component';
import { PaginatedData } from '@core/shared/types';

@Component({
  selector: 'app-ver-convocatorias',
  imports: [CardGenericComponent, PaginationComponent, CargandoComponent],
  templateUrl: './ver-convocatorias.component.html',
  styleUrl: './ver-convocatorias.component.scss',
})
export default class VerConvocatoriasComponent implements OnDestroy, OnInit {
  totalPaginas = signal<number>(1);
  convocatorias = signal<convocatoriaDTO[]>([]);
  //store
  convocatoriaStore = inject(convocatoriasStore);
  //service
  alertaService = inject(AlertasService);
  paginatedService = inject(PaginationService);
  pagina = signal<number>(1);
  text = textVerConvocatorias;
  ngOnInit(): void {
    this.paginatedService.reset();
  }

  setConvocatoria = effect(() => {
    const response = this.getStudents.data();
    if (response) {
      this.convocatorias.set(response.page);
      this.totalPaginas.set(response.metadata?.totalPages!);
    } else this.convocatorias.set([]);
  });
  getStudents = injectQuery(() => ({
    queryKey: ['convocatoria', this.pagina()],

    queryFn: async (): Promise<PaginatedData<convocatoriaDTO[]>> => {
      const response = await this.convocatoriaStore.getConvocatorias(
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
