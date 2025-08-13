import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { todoFeature } from '../../state/reducers/todo.reducer';
import { TodoListComponent } from './todo-list/todo-list.component';
import { FilterTodosService } from './filter-todos/filter-todos.service';
import { MatList, MatListItem, MatListItemLine, MatListItemTitle } from '@angular/material/list';
import { map } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'pi-lot-todo-page',
	imports: [
		AsyncPipe,
		TodoListComponent,
		NgIf,
		DatePipe,
		MatList,
		MatListItem,
		MatListItemLine,
		MatListItemTitle,
		NgForOf,
		MatDividerModule,
		MatButtonModule,
		MatIconModule
	],
	template: `
		<pi-lot-todo-list *ngIf="(todos$ | async) as todos" [todos]="filterTodosService.filter(todos)">
		</pi-lot-todo-list>

		<mat-divider vertical="true" class="divider"></mat-divider>

		<div class="latest-todos-container">
			<button class="latest-todos-toggle" mat-icon-button (click)="onShowLatestTodosClick()">
				<mat-icon>{{ showLatestTodos() ? "keyboard_arrow_right" : "keyboard_arrow_left" }}</mat-icon>
			</button>
			@if (showLatestTodos()) {
				<h2>Latest Todos</h2>
				<mat-list role="list">
					<mat-list-item class="latest-todo-item" *ngFor="let todo of latestTodos$ | async" role="listitem">
						<span matListItemTitle>{{ todo.title }}</span>
						<span matListItemLine>Date: {{ todo.date | date }}</span>
						<span matListItemLine>Last edited: {{ todo.lastEdited | date }}</span>
					</mat-list-item>
				</mat-list>
			}
		</div>
	`,
	standalone: true,
	styles: `
		:host {
			display: flex;
			flex-direction: row;
			padding: 1rem;
			height: 100%;
			box-sizing: border-box;
		}

		.latest-todos-container {
			display: flex;
			flex-direction: column;
			padding: 1rem;

			.latest-todo-item {
				border-left: var(--mat-sys-on-secondary-container) dotted 0.125rem;
				border-radius: 0.75rem;
				margin-top: 1rem;
			}

			.latest-todo-item:hover {
				background-color: var(--mat-sys-background);
			}
		}

		// TODO: breakpointObserver?
		@media (max-width: 768px) {
			:host {
				flex-wrap: wrap;
			}

			.divider {
				display: none;
			}

			.latest-todos-toggle {
				display: none;
			}
		}
	`
})
export class TodoPageComponent {

	private readonly store = inject(Store);
	protected readonly filterTodosService = inject(FilterTodosService);
	protected readonly latestTodos$ = this.store.select(todoFeature.selectTodos).pipe(
		map(todos => {
			return [...todos]
				.sort((a, b) => b.lastEdited.getDate() - a.lastEdited.getDate())
				.slice(0, todos.length < 5 ? todos.length : 5);
		})
	);

	protected showLatestTodos = signal(false);

	constructor() {}

	readonly todos$ = this.store.select(todoFeature.selectTodos);

	onShowLatestTodosClick() {
		this.showLatestTodos.set(!this.showLatestTodos())
	}
}
