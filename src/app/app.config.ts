import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import{provideHttpClient, withInterceptors} from '@angular/common/http';
import { AdminTokenInterceptor } from './admin_Zone/interceptors/admin-token.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([AdminTokenInterceptor]))
    
  ]
};
