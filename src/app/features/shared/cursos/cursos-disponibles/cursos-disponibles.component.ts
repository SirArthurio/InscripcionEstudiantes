import { Component, inject, OnInit, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { textCrusosDisponibles } from './const/text.cursos-disponibles';
import { cursosDisponiblesMock } from './data/data';
import { StatusService } from '../../../../core/shared/service/status/status.service';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { cursoDisponible } from '../models/cursoDisponible.type';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-cursos-disponibles',
  imports: [TagModule, ButtonModule, TitleCasePipe],
  templateUrl: './cursos-disponibles.component.html',
  styleUrl: './cursos-disponibles.component.scss',
})
export class CursosDisponiblesComponent implements OnInit {
  misCursos = signal<cursoDisponible[]>([]);
  texto = textCrusosDisponibles;
  statusService = inject(StatusService);

  ngOnInit(): void {
    this.cursosDisponibles(cursosDisponiblesMock);
  }

  statusColor(status: string): ButtonSeverity {
    return this.statusService.statusColor(status);
  }
  cursosDisponibles(cursos: cursoDisponible[]) {
    if (cursos) {
      const filtro = cursos.filter((e) => e.availableSeats > 0);
      this.misCursos.set(filtro);
    }
  }
}
