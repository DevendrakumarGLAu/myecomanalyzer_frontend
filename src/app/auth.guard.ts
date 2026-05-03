import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token'); // adjust if using service

  if (token) {
    return true;
  }

  // redirect to login with return url (optional but useful)
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};