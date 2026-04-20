import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStr = localStorage.getItem('user');

  if (!userStr) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const user = JSON.parse(userStr);
    const requiredRoles = route.data['roles'] as string[];

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    const userRoles = user.roles?.map((r: any) => r.role?.name || r.name || r) || [];
    console.log('User roles:', userRoles);
    console.log('Required roles:', requiredRoles);
    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      console.log('Access denied - user does not have required role');
      router.navigate(['/dashboard']);
      return false;
    }

    return true;
  } catch (error) {
    router.navigate(['/login']);
    return false;
  }
};
