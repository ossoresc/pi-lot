import { Injectable, inject } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { authActions } from '../actions/auth.actions';
import { catchError, switchMap, of, mergeMap, EMPTY } from 'rxjs';
import { ApiAuthService } from '../../services/api/api-auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthEffects {

	private actions$ = inject(Actions);
	private apiAuthService = inject(ApiAuthService);
	private router = inject(Router);
	private snackbar = inject(MatSnackBar);

	login$ = createEffect(() => (
		this.actions$.pipe(
			ofType(authActions.login),
			mergeMap(action => {
				if (action.loginData == null)
					return of(authActions.loginFailure({error: "Login data is null"}));

				return this.apiAuthService.login(action.loginData)
					.pipe(
						switchMap((user) => {
							if (user == undefined) return of(authActions.loginFailure({error: "Couldn't find and login user"}));
							return [authActions.loginSuccess({user})];
						}),
						catchError(error => {
							this.snackbar.open("Login failed, wrong username and password", "Close");
							return of(authActions.loginFailure({error}));
						})
					)
			})
		)
	));

	loginSuccess$ = createEffect(() => (
		this.actions$.pipe(
			ofType(authActions.loginSuccess),
			mergeMap(action => {
				if (action.user == null || action.user.id == undefined)
					return of(authActions.loginFailure({error: "User is null"}));

				this.router.navigate(["home"]);

				return EMPTY
			})
		)
	), { dispatch: false });

	loginFailure$ = createEffect(() => (
		this.actions$.pipe(
			ofType(authActions.loginFailure),
			mergeMap(action => {
				this.snackbar.open("Login failed, couldn't find username and password", "Close", { duration: 5000 });

				return EMPTY
			})
		)
	), { dispatch: false });

	logout$ = createEffect(() => (
		this.actions$.pipe(
			ofType(authActions.logout),
			switchMap(action => {
				this.router.navigate(["login"]);
				return EMPTY
			})
		)
	), { dispatch: false });
}
