import { Component } from '@angular/core';
import { CursosDisponiblesComponent } from 'src/app/features/shared/cursos/cursos-disponibles/cursos-disponibles.component';

@Component({
  selector: 'app-ver-convocatoria',
  imports: [CursosDisponiblesComponent],
  templateUrl: './ver-convocatoria.component.html',
  styleUrl: './ver-convocatoria.component.scss',
})
export default class VerConvocatoriaComponent {}
