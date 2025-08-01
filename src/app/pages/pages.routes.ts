import { Routes } from '@angular/router';
import { CursoGenericoComponent } from './shared/cursos/curso-generico/curso-generico.component';

export default [
  {
    path: 'mis-cursos',
    component: CursoGenericoComponent,
  },
  {
    path: 'calendario',
    loadComponent: () => import('./shared/calendario/calendario.component'),
  },
] as Routes;
