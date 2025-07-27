import { ApplicationConfig, inject, LOCALE_ID, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { todoReducer, todoReducerKey } from './state/reducers/todo.reducer';
import { provideEffects } from '@ngrx/effects';
import { TodoEffects } from './state/effects/todo.effects';
import { AppInitializerService } from './services/app-initializer.service';
import {
	MAT_DATE_FORMATS,
	MAT_DATE_LOCALE,
	MatNativeDateModule,
	provideNativeDateAdapter
} from '@angular/material/core';
import { PI_LOT_DATE_FORMATS } from './util/pi-lot-date-formats.constant';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { authReducer, authReducerKey } from './state/reducers/auth.reducer';
import { AuthEffects } from './state/effects/auth.effects';

registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
	providers: [
		provideAppInitializer(() => {
			const appInitializerService = inject(AppInitializerService);
			appInitializerService.initializeApp();
		}),
		provideZoneChangeDetection({eventCoalescing: true}),
		provideRouter(routes),
		provideHttpClient(),

		// ngrx (State Management)
		provideStore(),
		provideState(todoReducerKey, todoReducer),
		provideState(authReducerKey, authReducer),

		provideEffects(TodoEffects),
		provideEffects(AuthEffects),

		// Date
		// TODO: multi language?
		{ provide: LOCALE_ID, useValue: 'de-DE' },
		provideNativeDateAdapter(PI_LOT_DATE_FORMATS),
		MatNativeDateModule,
		{ provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
		{ provide: MAT_DATE_FORMATS, useValue: PI_LOT_DATE_FORMATS },
	]
};
