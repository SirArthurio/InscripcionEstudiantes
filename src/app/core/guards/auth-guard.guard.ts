import { effect, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { currentStore } from 'src/app/pages/auth/store/current.store';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const currentUserStore = inject(currentStore);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[];

  const userRole = currentUserStore.role();

  if (requiredRoles.includes(userRole)) {
    return true;
  }

  alert('Acceso denegado. No tienes permisos.');
  router.navigate(['/common/acces']);
  return false;
};
