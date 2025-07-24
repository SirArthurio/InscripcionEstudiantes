import { Routes } from '@angular/router';
import { CursoGenericoComponent } from './cursos/curso-generico/curso-generico.component';
import { CalendarioComponent } from './calendario/calendario.component';

export default [
  {
    path: 'mis-cursos',
    component: CursoGenericoComponent,
  },
  {
    path: 'calendario',
    component: CalendarioComponent,
  },
] as Routes;
