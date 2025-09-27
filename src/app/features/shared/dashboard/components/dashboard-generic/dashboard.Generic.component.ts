import { Component, effect, inject, input, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { headerDasboard } from '../../constants/text.headerDashboardEstudiante.const';
import { convocatoria } from '../../../../admin/convocatorias/model/convocatoria.type';
import { HeaderDashboardComponent } from 'src/app/features/shared/dashboard/components/header-dashboard/header-dashboard.component';
import { CursosDisponiblesComponent } from 'src/app/features/shared/cursos/cursos-disponibles/cursos-disponibles.component';
import { ConvocatoriasActivasComponent } from '../../../convocatorias/convocatorias-activas/convocatorias-activas.component';
import { headerDasboardType } from '../../dashboard/dashboard.type';
import { CurrentStore } from 'src/app/features/auth/store/current.store';

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
  //store
  currentUser = inject(CurrentStore);
  //inputs
  rol = signal<string>('');
  datos = input<dashboardData>();
  header = signal<headerDasboardType>(headerDasboard(this.currentUser.role()));
  urlConvocatoria = input<string>('');
}
