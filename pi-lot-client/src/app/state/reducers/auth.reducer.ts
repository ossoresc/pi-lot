import { UserDto } from '@pi-lot-interfaces/src/dtos/user.dto';
import { createReducer, createFeature, on } from '@ngrx/store';
import { authActions } from '../actions/auth.actions';

export const authReducerKey = "auth";

export interface AuthState {
	isAuthenticated: boolean;
	user: UserDto | null;
	loading: boolean;
	error: string | null;
}

export const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	loading: false,
	error: null
}

export const authReducer = createReducer(
	initialState,
	on(authActions.login, (state) => ({...state, loading: true})),
	on(authActions.loginSuccess, (state, {user}) => ({
		...state,
		isAuthenticated: true,
		user: user,
		loading: false,
		error: null
	})),
	on(authActions.loginFailure, (state, {error}) => ({
		...state,
		isAuthenticated: false,
		user: null,
		loading: false,
		error: error
	})),
	on(authActions.logout, (state) => ({...state, isAuthenticated: false, user: null})),
	on(authActions.logoutSuccess, (state) => ({...state, isAuthenticated: false, user: null})),
	on(authActions.logoutFailure, (state) => ({...state, isAuthenticated: false, user: null})),
);

export const authFeature = createFeature({
	name: authReducerKey,
	reducer: authReducer
});
