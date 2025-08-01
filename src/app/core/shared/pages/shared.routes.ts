import { Routes } from '@angular/router';

export default [
  {
    path: 'error',
    loadComponent: () => import('./error/error.component'),
  },
  {
    path: 'acces',
    loadComponent: () => import('./acces/acces.component'),
  },
  {
    path: 'nofound',
    loadComponent: () => import('./nofound/nofound.component'),
  },
] as Routes;
