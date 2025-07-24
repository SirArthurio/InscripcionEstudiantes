import { Component, signal } from '@angular/core';
import { HeaderDashboardComponent } from '../../../components/shared/header-dashboard/header-dashboard.component';
import { headerDasboard } from '../../../components/dashboard/constants/text.headerDashboardEstudiante.const';
import { headerDasboardType } from '../../../core/shared/types/dashboard';

@Component({
  selector: 'app-curso-generico',
  imports: [HeaderDashboardComponent],
  standalone: true,
  templateUrl: './curso-generico.component.html',
  styleUrl: './curso-generico.component.scss',
})
export class CursoGenericoComponent {
  header = signal<headerDasboardType>(headerDasboard('profesor'));
}
