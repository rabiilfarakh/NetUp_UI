import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../../service/user.service';
import { AuthService } from '../service/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(AuthService);
  const token = service.getToken();

  if (token) {

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
