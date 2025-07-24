import { Component, input, signal } from '@angular/core';
import { headerDasboard } from '../constants/text.headerDashboardEstudiante.const';
import { AvatarModule } from 'primeng/avatar';
import { ConvocatoriasActivasComponent } from '../../shared/convocatorias-activas/convocatorias-activas.component';
import { HeaderDashboardComponent } from '../../shared/header-dashboard/header-dashboard.component';
import { headerDasboardType } from '../../../core/shared/types/dashboard/index';
import { convocatoria } from '../../../core/shared/types/convocatorias';
import { CursosDisponiblesComponent } from '../../shared/cursos-disponibles/cursos-disponibles.component';
interface dashboardData {
  convocatoria: convocatoria;
  header: headerDasboardType;
}
@Component({
  selector: 'app-dashboard-Generic',
  imports: [
    AvatarModule,
    ConvocatoriasActivasComponent,
    HeaderDashboardComponent,
    CursosDisponiblesComponent,
  ],
  templateUrl: './dashboard.Generic.component.html',
  styleUrl: './dashboard.Generic.component.scss',
})
export class DashboardGenericComponent {
  datos = input<dashboardData>();
  header = signal<headerDasboardType>(headerDasboard('profesor'));
}
