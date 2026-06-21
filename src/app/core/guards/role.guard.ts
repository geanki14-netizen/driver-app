import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services';

export function roleGuard(allowedRoles: ('admin' | 'user')[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const user = auth.getCurrentUser();

    if (!user) {
      router.navigateByUrl('/auth/login', { replaceUrl: true });
      return false;
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    router.navigateByUrl('/home', { replaceUrl: true });
    return false;
  };
}