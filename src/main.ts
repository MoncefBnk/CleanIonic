import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { i18nProviders } from './app/core/providers/i18n.provider';
import { LocalStorageService } from './app/core/services/local-storage.service';
import { FirestoreService } from './app/core/services/firestore.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { MusicService } from './app/core/services/music.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    FirestoreService,
    LocalStorageService,
    MusicService,
    i18nProviders,
    provideHttpClient(),
    provideIonicAngular(),
    importProvidersFrom(IonicModule.forRoot()),
    provideRouter(routes),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, }, 
    provideFirebaseApp(() => initializeApp(environment.firebase)), 
    provideAuth(() => getAuth()),
  ],
});
