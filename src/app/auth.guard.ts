import {
  inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  isPlatformBrowser
} from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const platformId = inject(PLATFORM_ID);

  // Prevent SSR crash
  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  router.navigate(['/login'], {
    queryParams: {
      returnUrl: state.url
    }
  });

  return false;
};