import { Component, input, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { headerDasboard } from '../../constants/text.headerDashboardEstudiante.const';
import { convocatoria } from '../../../../Admin/convocatorias/crear-convocatoria/model/convocatoria.type';
import { HeaderDashboardComponent } from 'src/app/pages/shared/dashboard/components/header-dashboard/header-dashboard.component';
import { CursosDisponiblesComponent } from 'src/app/pages/shared/cursos/cursos-disponibles/cursos-disponibles.component';
import { ConvocatoriasActivasComponent } from '../../../convocatorias/convocatorias-activas/convocatorias-activas.component';
import { headerDasboardType } from '../../dashboard/dashboard.type';

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
