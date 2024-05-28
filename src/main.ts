import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { i18nProviders } from './app/core/providers/i18n.provider';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    i18nProviders,
    provideHttpClient(),
    provideIonicAngular(),
    provideRouter(routes),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },
  ],
});
