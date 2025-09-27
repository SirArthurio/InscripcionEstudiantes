import { effect, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CurrentStore } from 'src/app/features/auth/store/current.store';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const currentUserStore = inject(CurrentStore);
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
