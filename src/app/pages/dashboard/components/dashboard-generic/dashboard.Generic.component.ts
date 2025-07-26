import { Component, input, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CursosDisponiblesComponent } from '../../../../core/shared/components/cursos-disponibles/cursos-disponibles.component';
import { HeaderDashboardComponent } from '../../../../core/shared/components/header-dashboard/header-dashboard.component';
import { convocatoria } from '../../../../core/shared/types/convocatorias';
import { headerDasboardType } from '../../../../core/shared/types/dashboard';
import { headerDasboard } from '../../constants/text.headerDashboardEstudiante.const';
import { ConvocatoriasActivasComponent } from '../../../../core/shared/components/convocatorias-activas/convocatorias-activas.component';

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
