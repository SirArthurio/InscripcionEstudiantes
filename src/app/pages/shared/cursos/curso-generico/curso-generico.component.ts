import { Component, signal } from '@angular/core';
import { HeaderDashboardComponent } from '../../dashboard/components/header-dashboard/header-dashboard.component';
import { headerDasboard } from '../../dashboard/constants/text.headerDashboardEstudiante.const';
import { headerDasboardType } from '../../dashboard/dashboard/dashboard.type';
import { BarraEstadoCursosComponent } from 'src/app/pages/shared/cursos/components/barra-estado-cursos/barra-estado-cursos.component';

@Component({
  selector: 'app-curso-generico',
  imports: [HeaderDashboardComponent, BarraEstadoCursosComponent],
  standalone: true,
  templateUrl: './curso-generico.component.html',
  styleUrl: './curso-generico.component.scss',
})
export class CursoGenericoComponent {
  header = signal<headerDasboardType>(headerDasboard('profesor'));
}
