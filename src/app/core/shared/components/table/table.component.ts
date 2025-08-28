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
import { FiltroComponent } from '../filtro/filtro.component';
import { GrupoFiltros } from '@core/shared/types';
interface tableData {
  datos: any[];
  url: string;
  ignorar?: string[];
}
@Component({
  selector: 'app-table',
  imports: [
    TableModule,
    CommonModule,
    PaginationComponent,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    CargandoComponent,
    FiltroComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  //inputs
  data = input.required<tableData>();
  totalPages = input<number>(1);
  rutaEdit = input<string>('');
  texto = input(tableConst);
  isLoading = input(false);
  //inputs filtro
  titulo = input('Filtros');
  gruposFiltros = input<GrupoFiltros[]>([]);
  mostrarLimpiar = input(true);
  mostrarContadores = input(true);
  design: 'horizontal' | 'vertical' | 'grid' = 'horizontal';
  //variables
  router = inject(Router);
  columnas = signal<string[]>([]);

  getColumns = effect(() => {
    if (this.data().datos && this.data().datos.length > 0) {
      const columnas = Object.keys(this.data().datos[0]);
      const columnasVisibles = columnas.filter(
        (e) => !this.data().ignorar?.includes(e)
      );
      this.columnas.set(columnasVisibles);
    }
  });
  edit(id: string) {
    this.router.navigate([`${this.data().url}`], {
      queryParams: {
        id: id,
      },
    });
  }
  filterGlobal(value?: string) {}
}
