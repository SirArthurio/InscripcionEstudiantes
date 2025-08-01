import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
export default [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register-estudiante/register-estudiante.component'),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password.component'),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.component'),
  },
  {
    path: 'verify-institutional-email',
    loadComponent: () =>
      import('./verify-intitucional-email/verify-intitucional-email.component'),
  },
  {
    path: 'send-institutional-email',
    loadComponent: () =>
      import('./send-institucional-email/send-institucional-email.component'),
  },
] as Routes;
