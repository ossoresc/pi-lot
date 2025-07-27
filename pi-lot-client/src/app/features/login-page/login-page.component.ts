import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
	FormGroup,
	NonNullableFormBuilder,
	ReactiveFormsModule,
	Validators
} from '@angular/forms';
import { LoginDataFormGroup } from './login-data-form-group.model';
import { Store } from '@ngrx/store';
import { authActions } from '../../state/actions/auth.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe, NgIf } from '@angular/common';
import { authFeature } from '../../state/reducers/auth.reducer';

@Component({
	selector: 'pi-lot-login-page',
	imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatProgressBarModule, NgIf, AsyncPipe],
	template: `
		<mat-card>
			<mat-card-content>
				<div class="login-form" [formGroup]="formGroup">
					<mat-form-field>
						<mat-label>Enter your username</mat-label>
						<input matInput type="text" formControlName="username"
							   [value]="formGroup.controls.username.value">
						<mat-icon matSuffix>person</mat-icon>
					</mat-form-field>

					<mat-form-field>
						<mat-label>Enter your password</mat-label>
						<input matInput type="password" formControlName="password"
							   [value]="formGroup.controls.password.value">
						<mat-icon matSuffix>password</mat-icon>
					</mat-form-field>
				</div>
			</mat-card-content>
			<mat-card-footer>
				<mat-progress-bar *ngIf="(isLoading$ | async)" mode="indeterminate"></mat-progress-bar>
			</mat-card-footer>
			<mat-card-actions align="end">
				<button mat-button (click)="onLoginClick()" [disabled]="!formGroup.valid">Login</button>
			</mat-card-actions>
		</mat-card>
	`,
	standalone: true,
	styles: `
		:host {
			display: flex;
			flex-direction: column;
			padding: 1rem;
			height: 100%;
			box-sizing: border-box;
			justify-content: center;
			align-items: center;
		}

		.login-form {
			display: flex;
			flex-direction: column;
			padding: 1rem;
			gap: 1rem;
		}
	`
})
export class LoginPageComponent {

	protected formGroup: FormGroup<LoginDataFormGroup>;

	private readonly store = inject(Store);
	private readonly snackbar = inject(MatSnackBar);

	protected readonly isLoading$ = this.store.select(authFeature.selectLoading);

	constructor(private fb: NonNullableFormBuilder) {
		this.formGroup = fb.group({
			username: fb.control("root", Validators.required),
			password: fb.control("root", Validators.required)
		});
	}

	onLoginClick() {
		const username = this.formGroup.controls.username.value;
		const password = this.formGroup.controls.password.value;

		if (username == null || password == null) {
			this.snackbar.open("Username and password are required", "Close", {duration: 3000});
			return;
		}

		this.store.dispatch(authActions.login({
			loginData: {
				username: username,
				password: password
			}
		}));
	}
}
