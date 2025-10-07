import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

// Enforces role-based access using route data: { roles: ['admin', 'student'] }
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowed = (route.data?.['roles'] as string[] | undefined) ?? [];
  const user = auth.studentValue;

  // If not logged in, bounce to login (authGuard should usually run first)
  if (!user) {
    router.navigateByUrl('/login');
    return false;
  }

  if (allowed.length === 0) return true; // no restriction

  const role = user.uloga;
  if (role && allowed.includes(role)) {
    return true;
  }

  // Not authorized: redirect to a safe page
  router.navigateByUrl('/app/welcome');
  return false;
};
