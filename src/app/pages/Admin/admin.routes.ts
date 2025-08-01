import { Routes } from '@angular/router';

export default [
  {
    path: 'convocatorias',
    children: [
      {
        path: 'crear-convocatorias',
        loadComponent: () =>
          import(
            './convocatorias/crear-convocatoria/crear-convocatoria.component'
          ),
      },
      {
        path: 'ver-convocatorias',
        loadComponent: () =>
          import(
            './convocatorias/ver-convocatorias/ver-convocatorias.component'
          ),
      },
    ],
  },
] as Routes;
