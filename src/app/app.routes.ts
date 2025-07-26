import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: '', component: Dashboard },
      { path: 'pages', loadChildren: () => import('./pages/pages.routes') },
      {
        path: 'admin',
        loadChildren: () => import('./pages/Admin/admin.routes'),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes'),
  },

  {
    path: 'pagina-no-encontrada',
    loadComponent: () =>
      import('./core/shared/pages/nofound/nofound.component').then(
        (e) => e.NofoundComponent
      ),
  },

  { path: '**', redirectTo: 'pagina-no-encontrada', pathMatch: 'full' },
];
