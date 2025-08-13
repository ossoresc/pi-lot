import { Component, inject, Input, ViewChild } from '@angular/core';
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import {
	MatAccordion,
	MatExpansionModule,
} from '@angular/material/expansion';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TodoDto } from '@pi-lot-interfaces/src/dtos/todo.dto';
import { todoActions } from '../../../../state/actions/todo.actions';
import { DomSanitizer } from '@angular/platform-browser';
import { BreakpointService } from '../../../../services/breakpoint.service';
import { Store } from '@ngrx/store';
import { MatFormFieldModule, MatPrefix } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterTodosPipe } from '../../filter-todos-pipe/filter-todos.pipe';
import { TodoDialogComponent } from '../../todo-dialog/todo-dialog.component';
import { TodoDialogResult } from '../../todo-dialog/todo-dialog-result.model';
import { MatDialog } from '@angular/material/dialog';
import { todoFeature } from '../../../../state/reducers/todo.reducer';
import { DeleteTodoDialogComponent } from '../../delete-todo-dialog/delete-todo-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
	selector: 'pi-lot-todo-list-accordion',
	imports: [
		AsyncPipe,
		DatePipe,
		MatExpansionModule,
		MatCheckboxModule,
		MatIconModule,
		NgForOf,
		NgIf,
		NgClass,
		MatPrefix,
		MatButtonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		FilterTodosPipe,
		MatTooltipModule
	],
	template: `
		<mat-accordion id="accordion" #accordion multi>
			<mat-expansion-panel *ngFor="let todo of todos | filterTodos:searchText"
								 [expanded]="(lastUpdatedId$ | async) === todo.id">

				<!-- Accordion Header -->
				<mat-expansion-panel-header>
					<mat-panel-title>
						<mat-checkbox matPrefix class="todo-checkbox" [checked]="todo.done"
									  (click)="onDoneClick($event, todo)" matTooltip="Done">
						</mat-checkbox>
						<p [innerHTML]="highlightSearchText(todo.title, searchText)"
						   [ngClass]="todo.done ? 'done' : ''"></p>
					</mat-panel-title>
					<mat-panel-description *ngIf="!(isMobile$ | async)">
						<div class="todo-title-description">
							<p [innerHTML]="highlightSearchText(todo.description, searchText)"
							   [ngClass]="todo.done ? 'done' : ''"></p>
						</div>
						<div class="todo-title-actions">
							<ng-container *ngIf="(todo.categories) && (todo.categories.length > 0)">
								<!--								<mat-icon *ngFor="let category of todo.categories"-->
								<!--										  [matTooltip]="category.description">info</mat-icon>-->
								<span *ngFor="let category of todo.categories">#{{ category.name }}</span>
							</ng-container>
						</div>
					</mat-panel-description>
				</mat-expansion-panel-header>

				<!-- Expanded Content -->
				<div class="todo-description-container">

					<!-- Expanded Content Header -->
					<div class="todo-description-header">
						<p>{{ todo.date | date:"EEE, dd.MM.YYYY" }}</p>
					</div>

					<!-- Expanded Content Description -->
					<div class="todo-description">
						<p [innerHTML]="highlightSearchText(todo.description, searchText)"></p>
					</div>

					<!-- Expanded Content Bottom Bar -->
					<div class="todo-description-actions">
						<span>Last edited: {{ todo.lastEdited | date:"EEE, dd.MM.y, HH:mm:ss" }}</span>

						<button mat-icon-button (click)="onEditClick(todo)" matTooltip="Edit">
							<mat-icon>edit</mat-icon>
						</button>

						<button mat-icon-button (click)="onDeleteClick(todo)" matTooltip="Delete">
							<mat-icon>delete</mat-icon>
						</button>
					</div>
				</div>

			</mat-expansion-panel>
		</mat-accordion>
	`,
	standalone: true,
	styles: `
		.mat-expansion-panel-title {
			justify-content: space-between;
			align-items: center;
			max-width: 50%;
			gap: 1rem;
		}

		// from angular material documentation example
		.mat-expansion-panel-header-description {
			justify-content: space-between;
			align-items: center;
			max-width: 70%;
			gap: 1rem;
		}

		.todo-title-description {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		.todo-description-container {
			display: flex;
			flex-direction: column;
			max-height: 20rem;

			.todo-description-header {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}

			.todo-description {
				flex: 1 1 auto;
				overflow: scroll;
			}

			.todo-description-actions {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap-reverse;
				justify-content: flex-end ;
				align-items: center;
				gap: 1rem;
				padding: 0.5rem;

				font-size: 0.9rem;
			}
		}

		.todo-checkbox {
			margin-right: 1.5rem;
			display: flex;
			align-items: center;
		}

		.todo-title-actions {
			display: flex;
			flex-direction: row;
			gap: 1rem;
		}

		.done {
			text-decoration: line-through;
		}
	`
})
export class TodoListAccordionComponent {

	@ViewChild(MatAccordion) accordion!: MatAccordion;

	@Input()
	public todos!: TodoDto[];

	@Input()
	public searchText!: string;

	private readonly store = inject(Store);
	private sanitizer = inject(DomSanitizer);
	private snackbar = inject(MatSnackBar);
	private breakpointService = inject(BreakpointService);
	private dialog = inject(MatDialog);

	protected readonly isMobile$ = this.breakpointService.isMobile$;
	protected readonly lastUpdatedId$ = this.store.select(todoFeature.selectLastUpdatedId);

	onDoneClick(event: MouseEvent, todo: TodoDto) {
		event.stopPropagation();
		const updatedTodo: TodoDto = {
			...todo,
			done: !todo.done
		};
		this.store.dispatch(todoActions.updateTodo({todo: updatedTodo}));
	}

	highlightSearchText(text: string, searchText: string) {
		if (!searchText) return text;

		const escapedSearch = searchText.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape Regex
		const regex = new RegExp(`(${escapedSearch})`, 'gi');

		const highlighted = text.replace(regex, '<mark>$1</mark>');

		return this.sanitizer.bypassSecurityTrustHtml(highlighted);
	}

	onDeleteClick(todo: TodoDto) {
		this.dialog.open<DeleteTodoDialogComponent, TodoDto, boolean>(DeleteTodoDialogComponent, {
			data: todo
		}).afterClosed()
			.subscribe(result => {
				if (result) {
					if (todo.id) {
						this.store.dispatch(todoActions.deleteTodo({id: todo.id}));
					} else {
						this.snackbar.open("Error while deleting: no ID found for Todo");
					}
				}
			});
	}

	onEditClick(todo: TodoDto) {
		this.dialog.open<TodoDialogComponent, TodoDto, TodoDialogResult>(TodoDialogComponent, {
			data: todo
		}).afterClosed()
			.subscribe(result => {
				if (result) {

					const updateTodo: TodoDto = {
						...result,
						id: result.id,
						title: result.title,
						date: result.date,
						description: result.description,
						done: result.done,
						lastEdited: new Date(),
						categories: result.categories
					}

					this.store.dispatch(todoActions.updateTodo({todo: updateTodo}));
				}
			});
	}

	collapseAll() {
		this.accordion.closeAll();
	}

	expandAll() {
		this.accordion.openAll();
	}
}
