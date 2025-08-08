import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { PaginationComponent } from '../pagination/pagination.component';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router, RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { tableConst } from './const/table.const';
import CargandoComponent from '../cargando/cargando.component';
@Component({
  selector: 'app-table',
  imports: [
    TableModule,
    CommonModule,
    PaginationComponent,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputText,
    CargandoComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  //inputs
  data = input.required<any>();
  totalPages = input<number>(1);
  rutaEdit = input<string>('');
  texto = input(tableConst);
  isLoading = input(false);
  //variables
  router = inject(Router);
  columnas = signal<string[]>([]);

  getColumns = effect(() => {
    if (Array.isArray(this.data()) && this.data().length > 0) {
      const { id, user, ...copia } = this.data()[0];
      this.columnas.set(Object.keys(copia));
    } else {
      const { id, user, ...copia } = this.data();

      this.columnas.set(Object.keys(copia));
    }
  });
  edit(id: string) {
    this.router.navigate(['/pages/estudiantes/estudiante', id]);
  }
  filterGlobal(value?: string) {}
}
