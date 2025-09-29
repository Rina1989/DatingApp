import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { InitService } from '../Core/services/init-service';
import { lastValueFrom, Observable } from 'rxjs';
import { errorInterceptor } from '../Core/interceptors/error-interceptor';
import { jwtInterceptor } from '../Core/interceptors/jwt-interceptor';
import { loadingInterceptor } from '../Core/interceptors/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,withViewTransitions()),
    provideHttpClient(withInterceptors([errorInterceptor,jwtInterceptor,loadingInterceptor])),
    provideAppInitializer(async()=>{
      const initService=inject(InitService);

      return new Promise<void>((resolve)=>{
        setTimeout(async()=>{
try {
        return lastValueFrom(initService.init())
      }finally{
        const splash=document.getElementById('initial-splash')
        if(splash){
          splash.remove();
        }
        resolve()
      }
        },500)
      })
      
    })
  ]
};
