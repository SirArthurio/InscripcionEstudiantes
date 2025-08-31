import { Routes } from '@angular/router';

export default [
  {
    path: 'convocatoria',
    children: [
      {
        path: 'ver-convocatoria',
        loadComponent: () =>
          import('./pages/ver-convocatoria/ver-convocatoria.component'),
      },
    ],
  },
  {
    path: 'certificados',
    children: [
      {
        path: 'subir-certificados',
        loadComponent: () =>
          import(
            './certificados/pages/subir-certificados/subir-certificados.component'
          ),
      },
    ],
  },
] as Routes;
