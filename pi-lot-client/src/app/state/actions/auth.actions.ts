import { createAction, props } from '@ngrx/store';
import { LoginData } from '@pi-lot-interfaces/src/models/login-data.model';
import { User } from '@pi-lot-interfaces/src/models/user.model';

export const login = createAction(
	'[Auth] Login',
	props<{ loginData: LoginData }>()
);

export const loginSuccess = createAction(
	'[Auth] Login Success',
	props<{ user: User }>()
);

export const loginFailure = createAction(
	'[Auth] Login Failure',
	props<{ error: string }>()
);

export const logout = createAction(
	'[Auth] Logout'
);

export const logoutSuccess = createAction(
	'[Auth] Logout Success'
);

export const logoutFailure = createAction(
	'[Auth] Logout Failure'
);

export const authActions = {
	login,
	loginSuccess,
	loginFailure,
	logout,
	logoutSuccess,
	logoutFailure
}
