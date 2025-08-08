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
import { StudentStore } from 'src/app/pages/Students/store/students.store';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PaginationService } from '@core/shared/components/pagination/pagination.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaginatedData } from '@core/shared/types';

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

  ngOnDestroy(): void {
    this.paginationService.reset();
  }
  ngOnInit(): void {
    this.paginationService.reset();
  }

  getpagina = effect(() => {
    this.currentPage.set(this.paginationService.currentPage());
  });

  status = toSignal(
    this.route.queryParams.pipe(map((q) => q['state'] || 'todos'))
  );

  setStudents = effect(() => {
    const response = this.getStudents.data();
    if (response) {
      this.students.set(response.page);
      this.totalPages.set(response.metadata?.totalPages!);
    } else this.students.set([]);
  });

  filter() {
    if (!this.status()) {
      this.status;
    }
  }

  getStudents = injectQuery(() => ({
    queryKey: ['estudiantes', this.currentPage(), this.status()],

    queryFn: async (): Promise<PaginatedData<student[]>> => {
      console.log('data', this.currentPage()!, '', this.status());
      const response = await this.studentStore.getStudents(
        this.currentPage()!,
        this.status()
      );
      if (!response) throw Error;
      return response.data;
    },
    staleTime: 1000 * 60,
  }));
}
