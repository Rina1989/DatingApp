import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { InitService } from '../Core/services/init-service';
import { lastValueFrom, Observable } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,withViewTransitions()),
    provideHttpClient(),
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
