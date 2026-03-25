import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { getAnalytics, provideAnalytics, ScreenTrackingService } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';

import { AVAILABLE_LANGS, DEFAULT_LANG } from '@core/const/lang.const';
import { authInterceptor } from '@core/interceptor/auth.interceptor';
import { errorInterceptor } from '@core/interceptor/error.interceptor';
import { I18nService } from '@core/services/i18n.service';
import { I18nTranslationService } from '@core/services/i18n-loader.service';
import { environment } from '@environments/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAppInitializer(() => inject(I18nService).initialize()),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor]),
      withInterceptorsFromDi()
    ),
    provideTransloco({
      config: {
        availableLangs: AVAILABLE_LANGS,
        defaultLang: DEFAULT_LANG,
        fallbackLang: DEFAULT_LANG,
        prodMode: environment.production,
        reRenderOnLangChange: true,
      },
      loader: I18nTranslationService,
    }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
  ],
};
