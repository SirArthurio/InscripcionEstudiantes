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
    console.log('Ejecutando obtenerConvocatoria');
    console.log('QueryParams completos:', this.router.snapshot.queryParamMap);
    console.log('Todas las keys:', this.router.snapshot.queryParamMap.keys);

    const id = this.router.snapshot.queryParamMap.get('convocatoria');
    console.log('ID obtenido:', id);

    if (id) {
      console.log('obtener convocatoria id:', id);
      this.grupoStore.setConvocatoriaId(id);
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
