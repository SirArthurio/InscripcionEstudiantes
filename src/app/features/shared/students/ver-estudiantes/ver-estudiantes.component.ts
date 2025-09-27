import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { TableComponent } from '@core/shared/components/table/table.component';
import { student } from '@core/shared/types/users/estudiante.type';
import { StudentStore } from 'src/app/features/students/store/students.store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentResponsePaginated, PaginatedData } from '@core/shared/types';
import { filtrosEstudiantes } from '../const/filtros-estudiante.const';
import { FiltroService } from '@core/shared/components/filtro/filtro.service';
import { statusEstudiantes } from '@core/shared/enums/status-estudiantes-type.enum';

@Component({
  selector: 'app-ver-estudiantes',
  imports: [TableComponent],
  templateUrl: './ver-estudiantes.component.html',
  styleUrl: './ver-estudiantes.component.scss',
})
export default class VerEstudiantesComponent implements OnInit, OnDestroy {
  //servicio
  paginationService = inject(PaginationService);
  //store
  studentStore = inject(StudentStore);
  //variables
  students = signal<student[]>([]);
  totalPages = signal<number>(1);
  route = inject(ActivatedRoute);
  currentPage = signal<number>(1);
  filtros = filtrosEstudiantes;
  filtroService = inject(FiltroService);
  status = signal<statusEstudiantes>(statusEstudiantes.activos);
  ngOnDestroy(): void {
    this.paginationService.reset();
  }
  ngOnInit(): void {
    this.paginationService.reset();
  }

  getpagina = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });

  getStatus = effect(() => {
    const status = this.filtroService.currentFiltro();
    if (status !== '') {
      this.status.set(status as statusEstudiantes);
    }
  });

  // setStudents = effect(() => {
  //   const response = this.getStudents.data();
  //   if (response) {
  //     this.students.set(response.page);
  //     this.totalPages.set(response.metadata?.totalPages!);
  //   } else this.students.set([]);
  // });

  filter() {
    if (!this.status()) {
      this.status;
    }
  }

  getStudents = injectQuery(() => ({
    queryKey: ['estudiantes', this.currentPage(), this.status()],

    queryFn: async () => {
      try {
        console.log('data', this.currentPage()!, '', this.status());
        const response = await this.studentStore.getStudents(
          this.currentPage()!,
          this.status()
        );
        console.log(response);
        if (!response) throw Error;
        return response;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 1000 * 60,
  }));
}
