import { createSelector } from '@ngrx/store';
import { authFeature } from '../reducers/auth.reducer';

export const selectAuthUser = createSelector(
	authFeature.selectAuthState,
	(state) => state.user
);

export const selectIsAuthenticated = createSelector(
	authFeature.selectAuthState,
	(state) => state.isAuthenticated
);

export const selectAuthLoading = createSelector(
	authFeature.selectAuthState,
	(state) => state.loading
);
