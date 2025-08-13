import { Component, inject, Input, signal } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FilterTodosPipe } from '../filter-todos-pipe/filter-todos.pipe';
import { TodoDto } from '@pi-lot-interfaces/src/dtos/todo.dto';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { clearTodos, todoActions } from '../../../state/actions/todo.actions';
import { Store } from '@ngrx/store';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClearTodoDialogComponent } from '../clear-todo-dialog/clear-todo-dialog.component';
import { TodoDialogResult } from '../todo-dialog/todo-dialog-result.model';
import { TodoListAccordionComponent } from './todo-list-accordion/todo-list-accordion.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { FilterTodosComponent } from '../filter-todos/filter-todos.component';
import { MatBadgeModule } from '@angular/material/badge';
import { FilterTodosService } from '../filter-todos/filter-todos.service';

@Component({
	selector: 'pi-lot-todo-list',
	imports: [
		FilterTodosPipe,
		NgIf,
		MatIconModule,
		MatCheckboxModule,
		FormsModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatInputModule,
		MatDialogModule,
		MatButtonModule,
		MatTooltipModule,
		TodoListAccordionComponent,
		NgClass,
		MatChipsModule,
		MatDividerModule,
		FilterTodosComponent,
		MatBadgeModule
	],
	template: `
		<div class="header-container">
			<mat-form-field class="search-form-field" hintLabel="" cdkFocusInitial appearance="outline">
				<mat-label>Search for Todo</mat-label>
				<input matInput #input maxlength="30" placeholder="" [(ngModel)]="searchText"/>
				<mat-hint *ngIf="input.value" align="end">Found: {{ (todos | filterTodos:searchText).length }}
					of {{ todos.length }}
				</mat-hint>
				<button mat-icon-button matSuffix *ngIf="input.value" (click)="searchText = ''">
					<mat-icon>clear</mat-icon>
				</button>
			</mat-form-field>

			<div class="action-container">
				<button mat-icon-button matTooltip="Add" (click)="onAddButtonClick()">
					<mat-icon>add</mat-icon>
				</button>

				<button  mat-icon-button matTooltip="Filter" (click)="showFilter.set(!showFilter())"
						 [matBadge]="filterTodosService.getSelectedCategoriesLength()"
						 [matBadgeHidden]="filterTodosService.getSelectedCategoriesLength() === 0"
						[ngClass]="showFilter() ? 'filter-open' : ''">
					<mat-icon>{{ showFilter() ? 'filter_list_off' : 'filter_list' }}</mat-icon>
				</button>

				<button mat-icon-button matTooltip="Collapse all"
						(click)="openTodosAccordion.collapseAll(); doneTodosAccordion.collapseAll();">
					<mat-icon>unfold_less</mat-icon>
				</button>

				<button mat-icon-button matTooltip="Expand all"
						(click)="openTodosAccordion.expandAll(); doneTodosAccordion.expandAll();">
					<mat-icon>unfold_more</mat-icon>
				</button>

				<button mat-icon-button matTooltip="Clear" (click)="onClearButtonClick()">
					<mat-icon>clear</mat-icon>
				</button>
			</div>
		</div>

		<pi-lot-filter-todos *ngIf="showFilter()">

		</pi-lot-filter-todos>

		<div class="todo-list">
			<p *ngIf="todos.length == 0">No Todos yet ... create a new one!</p>

			<pi-lot-todo-list-accordion #openTodosAccordion
										[todos]="getOpenTodos()"
										[searchText]="searchText">
			</pi-lot-todo-list-accordion>

			<pi-lot-todo-list-accordion #doneTodosAccordion
										[todos]="getDoneTodos()"
										[searchText]="searchText">
			</pi-lot-todo-list-accordion>
		</div>
	`,
	standalone: true,
	styles: `
		:host {
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 100%;
			box-sizing: border-box;
		}

		.header-container {
			display: flex;
			flex-direction: row;
			align-items: center;
			flex-wrap: wrap;
			gap: 1rem;
			padding: 1rem;
			box-sizing: border-box;

			.search-form-field {
				flex: 1 1 auto;
			}

			.action-container {
				flex: 1 1 auto;
				display: flex;
				flex-direction: row;
				gap: 1rem;
				justify-content: space-between;
				max-width: 20rem;
			}
		}

		.filter-open {
			background-color: var(--mat-sys-secondary-container);
		}

		.todo-list {
			display: flex;
			flex-direction: column;
			flex-grow: 0;
			padding: 1rem;
			overflow: auto;
			gap: 1rem;
			box-sizing: border-box;
		}
	`
})
export class TodoListComponent {

	@Input({transform: (value: TodoDto[] | null): TodoDto[] => value === null ? [] : value})
	public todos!: TodoDto[];

	public searchText = "";

	private readonly store = inject(Store);
	private dialog = inject(MatDialog);

	protected showFilter = signal(false);
	protected readonly filterTodosService = inject(FilterTodosService);

	getDoneTodos(): TodoDto[] {
		return this.todos.filter(todo => todo.done);
	}

	getOpenTodos(): TodoDto[] {
		return this.todos.filter(todo => !todo.done);
	}

	onAddButtonClick() {
		this.dialog.open<TodoDialogComponent, TodoDto, TodoDialogResult>(TodoDialogComponent, {
			data: null
		}).afterClosed()
			.subscribe(result => {
				if (result) {

					const newTodo: TodoDto = {
						title: result.title,
						date: result.date,
						description: result.description,
						done: result.done,
						lastEdited: new Date(),
						categories: result.categories
					}

					this.store.dispatch(todoActions.addTodo({todo: newTodo}));
				}
			});
	}

	onClearButtonClick() {
		this.dialog.open(ClearTodoDialogComponent).afterClosed().subscribe((result: boolean) => {
			if (result) {
				this.store.dispatch(clearTodos());
			}
		});
	}
}
