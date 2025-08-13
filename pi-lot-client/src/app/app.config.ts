import {
	ApplicationConfig,
	importProvidersFrom,
	inject,
	LOCALE_ID,
	provideAppInitializer,
	provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { todoReducer, todoReducerKey } from './state/reducers/todo.reducer';
import { provideEffects } from '@ngrx/effects';
import { TodoEffects } from './state/effects/todo.effects';
import { AppInitializerService } from './services/app-initializer.service';
import { authReducer, authReducerKey } from './state/reducers/auth.reducer';
import { AuthEffects } from './state/effects/auth.effects';
import { MatNativeDateModule } from '@angular/material/core';

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
		importProvidersFrom(MatNativeDateModule)
	]
};
