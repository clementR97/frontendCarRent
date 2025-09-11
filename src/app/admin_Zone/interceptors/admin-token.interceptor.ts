// src/app/interceptors/admin-token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminAuthService } from '../../services/admin-auth.service';

export const AdminTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const adminAuthService = inject(AdminAuthService);
  
  // Ajouter le token seulement pour les requêtes admin
  if (req.url.includes('/api/admin/') && !req.url.includes('/login')) {
    const token = adminAuthService.getToken();
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next(authReq);
    }
  }
  return next(req);
};