import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { Dashboard } from './features/shared/dashboard/dashboard';
import { authGuardGuard } from '@core/guards/auth-guard.guard';
import { UserTypes } from '@core/shared/enums/user-types.enum';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: '', component: Dashboard },
      { path: 'pages', loadChildren: () => import('./features/pages.routes') },
      {
        path: 'admin',
        data: { roles: [UserTypes.SUPERADMIN] },
        canActivate: [authGuardGuard],
        loadChildren: () => import('./features/admin/admin.routes'),
      },
      {
        data: { roles: [UserTypes.STUDENT] },
        canActivate: [authGuardGuard],
        path: 'students',
        loadChildren: () => import('./features/Students/students.routes'),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes'),
  },

  {
    path: 'common',
    loadChildren: () => import('./core/shared/pages/shared.routes'),
  },

  { path: '**', redirectTo: 'common/nofound', pathMatch: 'full' },
];
