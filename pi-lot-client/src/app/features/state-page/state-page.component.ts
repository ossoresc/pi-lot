import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe, NgForOf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { todoFeature } from '../../state/reducers/todo.reducer';
import { authFeature } from '../../state/reducers/auth.reducer';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StateViewerComponent } from './state-viewer/state-viewer.component';

export enum StateOptions {
	TODO_STATE = 'Todo State',
	AUTH_STATE = 'Auth State'
}

@Component({
	selector: 'pi-lot-state-page',
	imports: [
		AsyncPipe,
		MatCardModule,
		MatRippleModule,
		MatListModule,
		NgForOf,
		MatTreeModule,
		MatIconModule,
		MatButtonModule,
		MatSelectModule,
		StateViewerComponent,
		MatFormFieldModule,
		MatTooltipModule
	],
	template: `
		<div class="state-container">
			<h2>State</h2>
			<mat-form-field appearance="outline">
				<mat-label>Select State</mat-label>
				<mat-select [(value)]="selectedState">
					<mat-option *ngFor="let state of stateOptions"
								[value]="state">{{ state }}
					</mat-option>
				</mat-select>

				<div matSuffix class="state-actions">
					<button mat-icon-button (click)="onCollapseAllClick($event)" matTooltip="Collapse all">
						<mat-icon>unfold_less</mat-icon>
					</button>

					<button mat-icon-button (click)="onExpandAllClick($event)" matTooltip="Expand all">
						<mat-icon>unfold_more</mat-icon>
					</button>
				</div>
			</mat-form-field>

			<div class="state-viewer-wrapper">
				<pi-lot-state-viewer [key]="selectedState"
									 [value]="(getSelectedState() | async)"
									 [isCollapsed]="isCollapsed()">
				</pi-lot-state-viewer>
			</div>
		</div>
	`,
	styles: `
		:host {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			flex-wrap: wrap;
			height: 100%;
			max-height: 100%;
			box-sizing: border-box;
		}

		.state-container {
			border-right: var(--mat-sys-on-secondary-container) solid 0.01rem;
			display: flex;
			flex-grow: 1;
			padding: 1rem;
			flex-direction: column;
			max-height: 100%;
			max-width: 100%;
			overflow: auto;
			box-sizing: border-box;

			.state-actions {
				display: flex;
				flex-direction: row;
				padding-left: 1rem;
				padding-right: 0.5rem;
			}

			.state-content {
				font-size: 1rem;
			}

			.state-viewer-wrapper {
				display: flex;
				flex-direction: column;
				max-height: 100%;
				padding: 0.5rem 0;
				overflow: scroll;
			}
		}
	`
})
export class StatePageComponent {
	protected isCollapsed = signal(false);

	private readonly store = inject(Store);

	protected readonly todoState$ = this.store.select(todoFeature.selectTodoState);
	protected readonly authState$ = this.store.select(authFeature.selectAuthState)

	stateOptions = Object.values(StateOptions);

	protected readonly stateMap = new Map<StateOptions, any>([
		[StateOptions.TODO_STATE, this.todoState$],
		[StateOptions.AUTH_STATE, this.authState$]
	]);

	getSelectedState() {
		return this.stateMap.get(this.selectedState);
	}

	protected readonly StateOptions = StateOptions;
	selectedState: StateOptions = StateOptions.AUTH_STATE;

	onExpandAllClick(event: MouseEvent) {
		event.stopPropagation();
		this.isCollapsed.set(false);
	}

	onCollapseAllClick(event: MouseEvent) {
		event.stopPropagation();
		this.isCollapsed.set(true);
	}
}
