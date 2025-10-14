import { Routes } from '@angular/router';
import { CursoGenericoComponent } from './shared/cursos/curso-generico/curso-generico.component';
import { ConfigurationComponent } from './shared/config-profile/config-profile';

export default [
  {
    path: 'mis-cursos',
    component: CursoGenericoComponent,
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
  },
  {
    path: 'calendario',
    loadComponent: () => import('./shared/calendario/calendario.component'),
  },
  {
    path: 'cargando',
    loadComponent: () =>
      import('../core/shared/components/cargando/cargando.component'),
  },
  {
    path: 'estudiantes',
    children: [
      {
        path: 'lista-estudiantes',
        loadComponent: () =>
          import('./shared/students/ver-estudiantes/ver-estudiantes.component'),
      },
      {
        path: 'estudiante/:id',
        loadComponent: () =>
          import('./students/pages/student/student.component'),
      },
    ],
  },
] as Routes;
