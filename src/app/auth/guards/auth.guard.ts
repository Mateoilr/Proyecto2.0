import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // TODO: Implementar lógica de autenticación con tu servicio de auth
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  // Redirigir a login si no está autenticado
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
