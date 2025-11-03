import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { InitService } from '../Core/services/init-service';
import { lastValueFrom } from 'rxjs';
import { errorInterceptor } from '../Core/interceptor/error-interceptor';
import { jwtInterceptor } from '../Core/interceptor/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,withViewTransitions()),
    provideHttpClient(withInterceptors([errorInterceptor,jwtInterceptor])),
    provideAppInitializer(async()=>{
      const initserviec=inject(InitService)

      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          try {
            lastValueFrom(initserviec.init());
          } finally {
            const splash = document.getElementById('initial-splash');
            if (splash) {
              splash.remove();
            }
            resolve();
          }
        }, 500);
      })
      
    })
  ]
};
