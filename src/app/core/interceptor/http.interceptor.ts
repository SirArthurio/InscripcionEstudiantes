import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  let headersConfig: any = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headersConfig['Authorization'] = `Bearer ${token}`;
  }

  const clonedRequest = req.clone({ setHeaders: headersConfig });

  return next(clonedRequest);
};
