import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterPreloader } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); 
  const role = localStorage.getItem('role'); 

  if (token && role === 'ROLE_ADMIN') {
    return true;
  } else {
    router.navigate(['/access-denied']);
    return false;
  }};
