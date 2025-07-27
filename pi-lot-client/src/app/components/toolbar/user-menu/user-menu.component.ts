import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { authFeature } from '../../../state/reducers/auth.reducer';
import { authActions } from '../../../state/actions/auth.actions';

@Component({
	selector: 'pi-lot-user-menu',
	imports: [
		NgIf,
		AsyncPipe,
		RouterLink,
		MatButtonModule,
		MatMenuModule,
		MatIconModule
	],
	template: `
		<button *ngIf="!(isAuthenticated$ | async)" mat-button routerLink="/login">Login</button>

		<button *ngIf="isAuthenticated$ | async" mat-icon-button [matMenuTriggerFor]="menu">
			<mat-icon>person</mat-icon>
		</button>

		<mat-menu #menu="matMenu">
			<button mat-menu-item disabled>
				<mat-icon>person</mat-icon>
				<span>Profile</span>
			</button>
			<button mat-menu-item disabled>
				<mat-icon>settings</mat-icon>
				<span>Settings</span>
			</button>
			<button mat-menu-item (click)="onLogoutClick()">
				<mat-icon>logout</mat-icon>
				<span>Logout</span>
			</button>
		</mat-menu>
	`,
	styles: ``
})
export class UserMenuComponent {

	private readonly store = inject(Store);

	protected readonly isAuthenticated$ = this.store.select(authFeature.selectIsAuthenticated);

	onLogoutClick() {
		this.store.dispatch(authActions.logout());
	}
}
