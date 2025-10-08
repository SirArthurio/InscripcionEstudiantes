import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ConvocatoriaCardGenericComponent } from './components/card-generic/card-generic.component';
import { PaginationComponent } from '@core/shared/components/pagination/pagination.component';
import { textVerConvocatorias } from './const/textVerConvocatorias.const';
import { convocatoriaDTO } from '../../model/convocatoriaDTO.type';
import { convocatoriasStore } from '../../store/convocatorias.store';
import { AlertasService } from '@core/shared/service/Alertas/alertas.service';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import CargandoComponent from '@core/shared/components/cargando/cargando.component';
import { GrupoFiltros, PaginatedData } from '@core/shared/types';
import { FiltroComponent } from '@core/shared/components/filtro/filtro.component';
import { filtroTextConvocatoria } from './const/filtro-text-convocatoria.const';
import { FiltroService } from '@core/shared/components/filtro/filtro.service';
import { statusCompetencia } from '@core/shared/enums/status-competencia-type.enum';
import { statusConvocatorias } from '@core/shared/enums/status-convocatorias-type.enum';

@Component({
  selector: 'app-ver-convocatorias',
  imports: [
    ConvocatoriaCardGenericComponent,
    PaginationComponent,
    CargandoComponent,
    FiltroComponent,
  ],
  templateUrl: './ver-convocatorias.component.html',
  styleUrl: './ver-convocatorias.component.scss',
})
export default class VerConvocatoriasComponent implements OnDestroy, OnInit {
  totalPaginas = signal<number>(1);
  convocatorias = signal<convocatoriaDTO[]>([]);
  filtro = <GrupoFiltros[]>filtroTextConvocatoria;
  //store
  convocatoriaStore = inject(convocatoriasStore);
  //service
  alertaService = inject(AlertasService);
  paginatedService = inject(PaginationService);
  pagina = signal<number>(1);
  text = textVerConvocatorias;
  filtroService = inject(FiltroService);
  filtroActual = signal(this.filtroService.currentFiltro());

  ngOnInit(): void {
    this.paginatedService.reset();
    this.filtroService.actualizarFiltro(statusConvocatorias.publicada);
  }

  setConvocatoria = effect(() => {
    const response = this.getConvocatorias.data();
    console.log(response);
    if (response) {
      this.convocatorias.set(response.page);
      this.totalPaginas.set(response.metadata?.totalPages!);
    } else {
      this.convocatorias.set([]);
      this.totalPaginas.set(0);
    }
  });
  getConvocatorias = injectQuery(() => ({
    queryKey: ['convocatoria', this.filtroActual(), this.pagina()],

    queryFn: async (): Promise<PaginatedData<convocatoriaDTO[]>> => {
      const response = await this.convocatoriaStore.getConvocatorias(
        this.pagina(),
        this.filtroActual()
      );
      if (!response) throw Error;
      return response.data;
    },
    staleTime: 1000 * 60,
  }));
  getPagina = effect(() => {
    this.pagina.set(this.paginatedService.currentPage());
  });
  getFiltro = effect(() => {
    this.filtroActual.set(this.filtroService.currentFiltro());
  });
  ngOnDestroy(): void {
    this.paginatedService.reset();
    this.filtroService.resetFiltro();
  }
}
