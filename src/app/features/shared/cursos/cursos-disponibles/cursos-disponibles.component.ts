import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { textCrusosDisponibles } from './const/text.cursos-disponibles';
import { cursosDisponiblesMock } from './data/data';
import { StatusService } from '../../../../core/shared/service/status/status.service';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { cursoDisponible } from '../models/cursoDisponible.type';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GrupoStore } from 'src/app/features/admin/grupos/store/grupo.store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { grupoDto } from 'src/app/features/admin/grupos/model/grupoDto.type';

@Component({
  selector: 'app-cursos-disponibles',
  imports: [TagModule, ButtonModule, TitleCasePipe],
  templateUrl: './cursos-disponibles.component.html',
  styleUrl: './cursos-disponibles.component.scss',
})
export class CursosDisponiblesComponent implements OnInit {
  //inputs
  //store
  grupoStore = inject(GrupoStore);
  //injecciones
  router = inject(ActivatedRoute);
  //servicios
  statusService = inject(StatusService);
  paginationService = inject(PaginationService);
  //variables
  gruposDisponibles = signal<grupoDto[]>([]);
  texto = textCrusosDisponibles;
  convocatoriaId = signal<string>('');
  currentPage = signal<number>(1);

  ngOnInit(): void {
    // this.cursosDisponibles(cursosDisponiblesMock);
    this.obtenerConvocatoriaId();
  }
  obtenerConvocatoriaId() {
    const id = this.router.snapshot.queryParamMap.get('convocatoriaId');
    if (id) {
      this.convocatoriaId.set(id);
      console.log('id', id);
    }
  }
  obtenerPaginaActual = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });

  obtenerGrupos = injectQuery(() => ({
    queryKey: ['grupos', this.convocatoriaId(), this.currentPage()],
    queryFn: async () => {
      try {
        const response = await this.grupoStore.getGruposPorConvocatoria(
          this.currentPage(),
          this.convocatoriaId()
        );
        this.gruposDisponibles.set(response.data);
        console.log('data', response);
        return response;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));

  statusColor(status: string): ButtonSeverity {
    return this.statusService.statusColor(status);
  }
  // cursosDisponibles(cursos: cursoDisponible[]) {
  //   if (cursos) {
  //     const filtro = cursos.filter((e) => e.availableSeats > 0);
  //     this.gruposDisponibles.set(filtro);
  //   }
  // }
}
