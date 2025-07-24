import { Component, inject, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { textCrusosDisponibles } from './const/text.cursos-disponibles';
import { cursoDisponible } from '../../../core/shared/types/curso/cursoDisponible.type';
import { cursosDisponiblesMock } from './data/data';
import { StatusService } from '../../../core/shared/service/status/status.service';
import { ButtonModule, ButtonSeverity } from 'primeng/button';

@Component({
  selector: 'app-cursos-disponibles',
  imports: [TagModule, ButtonModule],
  templateUrl: './cursos-disponibles.component.html',
  styleUrl: './cursos-disponibles.component.scss',
})
export class CursosDisponiblesComponent {
  misCursos = signal<cursoDisponible[] | []>(cursosDisponiblesMock);
  texto = textCrusosDisponibles;
  statusService = inject(StatusService);

  statusColor(status: string): ButtonSeverity {
    return this.statusService.statusColor(status);
  }
}
