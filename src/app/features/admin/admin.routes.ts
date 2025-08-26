import { Routes } from '@angular/router';

export default [
  {
    path: 'convocatorias',
    children: [
      {
        path: 'crear-convocatorias',
        loadComponent: () =>
          import(
            './convocatorias/pages/crear-convocatoria/crear-convocatoria.component'
          ),
      },
      {
        path: 'ver-convocatorias',
        loadComponent: () =>
          import(
            './convocatorias/pages/ver-convocatorias/ver-convocatorias.component'
          ),
      },
    ],
  },
  {
    path: 'programas',
    children: [
      {
        path: 'ver-programas',
        loadComponent: () =>
          import('./programas/pages/ver-programas/ver-programas.component'),
      },
      {
        path: 'crear-programas',
        loadComponent: () =>
          import('./programas/pages/crear-programas/crear-programas.component'),
      },
    ],
  },
  {
    path: 'facultades',
    children: [
      {
        path: 'crear-facultad',
        loadComponent: () =>
          import('./facultades/pages/crear-facultad/crear-facultad.component'),
      },
      {
        path: 'ver-facultades',
        loadComponent: () =>
          import('./facultades/pages/ver-facultades/ver-facultades.component'),
      },
    ],
  },
  {
    path: 'professors',
    children: [
      {
        path: 'crear-professor',
        loadComponent: () =>
          import(
            './professor/pages/crear-professor/register-profesor.component'
          ),
      },
      {
        path: 'ver-professor',
        loadComponent: () =>
          import('./professor/pages/ver-professor/ver-professor.component'),
      },
    ],
  },
  {
    path: 'competencias',
    children: [
      {
        path: 'crear-competencias',
        loadComponent: () =>
          import(
            './competencias/pages/crear-competencia/crear-compentencia.component'
          ),
      },
      {
        path: 'ver-competencias',
        loadComponent: () =>
          import(
            './competencias/pages/ver-competencias/ver-competencias.component'
          ),
      },
    ],
  },
  {
    path: 'horarios',
    children: [
      {
        path: 'crear-horarios',
        loadComponent: () =>
          import('./schedules/pages/crear-schedules/crear-schedules.component'),
      },
      {
        path: 'ver-horarios',
        loadComponent: () =>
          import(
            './competencias/pages/ver-competencias/ver-competencias.component'
          ),
      },
    ],
  },
  {
    path: 'cursos',
    children: [
      {
        path: 'crear-cursos',
        loadComponent: () =>
          import('./cursos/pages/crear-cursos/crear-cursos.component'),
      },
      {
        path: 'ver-cursos',
        loadComponent: () =>
          import('./cursos/pages/ver-cursos/ver-cursos.component'),
      },
    ],
  },
  {
    path: 'grupos',
    children: [
      {
        path: 'crear-grupos',
        loadComponent: () =>
          import('./grupos/pages/crear-grupos/crear-grupos.component'),
      },
      {
        path: 'ver-grupos',
        loadComponent: () =>
          import('./grupos/pages/ver-grupos/ver-grupos.component'),
      },
    ],
  },
] as Routes;
