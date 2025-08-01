import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { Dashboard } from './pages/shared/dashboard/dashboard';

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
      {
        path: 'students',
        loadChildren: () => import('./pages/Students/students.routes'),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes'),
  },

  {
    path: 'common',
    loadChildren: () => import('./core/shared/pages/shared.routes'),
  },

  { path: '**', redirectTo: 'common/nofound', pathMatch: 'full' },
];
