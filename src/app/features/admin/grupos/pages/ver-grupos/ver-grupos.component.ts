import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '@core/shared/components/table/table.component';
import { GrupoStore } from '../../store/grupo.store';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ActivatedRoute } from '@angular/router';
import { grupoDto } from '../../model/grupoDto.type';

@Component({
  selector: 'app-ver-grupos',
  imports: [TableComponent],
  templateUrl: './ver-grupos.component.html',
  styleUrl: './ver-grupos.component.scss',
})
export default class VerGruposComponent implements OnInit {
  //servicios
  router = inject(ActivatedRoute);
  paginationService = inject(PaginationService);
  //store
  grupoStore = inject(GrupoStore);
  //variables
  grupos = signal<grupoDto[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  convocatoriaId = signal<string>('');

  ngOnInit() {
    this.obtenerConvocatoria();
  }

  obtenerPaginaActual = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });

  obtenerConvocatoria() {
    const id = this.router.snapshot.queryParamMap.get('convocatoria');
    if (id) {
      this.convocatoriaId.set(id);
    }
  }

  obtenerGrupos = injectQuery(() => ({
    queryKey: ['grupos', this.convocatoriaId()],
    queryFn: async () => {
      try {
        const response = await this.grupoStore.getGrupos(this.convocatoriaId());
        // this.grupos.set(response.data);
        console.log('data', response);
        return response;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));
}
