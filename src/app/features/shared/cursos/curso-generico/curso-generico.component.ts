import { Component, signal } from '@angular/core';
import { headerDasboard } from '../../dashboard/constants/text.headerDashboardEstudiante.const';
import { headerDasboardType } from '../../dashboard/dashboard/dashboard.type';

@Component({
  selector: 'app-curso-generico',
  imports: [],
  standalone: true,
  templateUrl: './curso-generico.component.html',
  styleUrl: './curso-generico.component.scss',
})
export class CursoGenericoComponent {
  header = signal<headerDasboardType>(headerDasboard('profesor'));
}
