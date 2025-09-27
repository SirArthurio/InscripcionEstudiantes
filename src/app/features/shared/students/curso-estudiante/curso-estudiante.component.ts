import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { HeaderDashboardComponent } from '../../dashboard/components/header-dashboard/header-dashboard.component';
import { headerDasboardType } from '../../dashboard/dashboard/dashboard.type';
import { headerDasboard } from '../../dashboard/constants/text.headerDashboardEstudiante.const';
import { BarraEstadoCursosComponent } from '../../cursos/components/barra-estado-cursos/barra-estado-cursos.component';
import { CursosDisponiblesComponent } from '../../cursos/cursos-disponibles/cursos-disponibles.component';

@Component({
  selector: 'app-curso-estudiante',
  imports: [
    SelectModule,
    ReactiveFormsModule,
    BarraEstadoCursosComponent,
    HeaderDashboardComponent,
    CursosDisponiblesComponent,
  ],
  templateUrl: './curso-estudiante.component.html',
  styleUrl: './curso-estudiante.component.scss',
})
export class CursoEstudianteComponent {
  header = signal<headerDasboardType>(headerDasboard('profesor'));
}
