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
    path: 'email-confirmation',
    loadComponent: () =>
      import('./email-confirmation/email-confirmation.component'),
  },
] as Routes;
