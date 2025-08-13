import { Component, inject } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { todoFeature } from '../../../state/reducers/todo.reducer';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { TodoCategoryDialogComponent } from '../todo-category-dialog/todo-category-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TodoCategoryDto } from '@pi-lot-interfaces/src/dtos/todo-category.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { todoActions } from '../../../state/actions/todo.actions';
import { FilterTodosService } from './filter-todos.service';

@Component({
	selector: 'pi-lot-filter-todos',
	imports: [
		AsyncPipe,
		MatChipsModule,
		MatIconModule,
		NgForOf,
		MatButtonModule,
		MatTooltipModule
	],
	template: `
		<span>Categories</span>
		<mat-chip-set>
			<mat-chip-option #option
							 *ngFor="let category of categories$ | async"
							 matTooltip="Right-click to delete"
							 [selected]="filterTodosService.hasCategory(category)"
							 (click)="onSelectionChange($event, option.selected, category)"
							 (contextmenu)="onCategoryContextmenu($event, category)">
				{{ category.name }}
			</mat-chip-option>

			<mat-chip-option selectable="false" (click)="onAddNewCategoryClick()">
				<mat-icon matChipAvatar>add</mat-icon>
				Add Category
			</mat-chip-option>
		</mat-chip-set>
	`,
	styles: `
		:host {
			display: flex;
			flex-direction: column;
			margin-bottom: 1rem;
			margin-left: 1rem;
			margin-right: 1rem;
			padding: 1rem;
			gap: 0.5rem;
			background-color: var(--mat-sys-secondary-container);
			border-radius: 1rem;
		}
	`
})
export class FilterTodosComponent {

	private readonly store = inject(Store);
	private readonly dialog = inject(MatDialog);
	private readonly snackbar = inject(MatSnackBar);
	protected readonly filterTodosService = inject(FilterTodosService);
	protected categories$ = this.store.select(todoFeature.selectCategories);

	onAddNewCategoryClick() {
		this.dialog.open(TodoCategoryDialogComponent);
	}

	onCategoryContextmenu(event: MouseEvent, category: TodoCategoryDto) {
		event.preventDefault();
		if (event.button === 2) {
			// Right-click
			if (category == null) {
				this.snackbar.open("Category is null", "Close", {duration: 3000});
				return;
			}

			if (category.id == null) {
				this.snackbar.open("Category ID is null", "Close", {duration: 3000});
				return;
			}

			this.store.dispatch(todoActions.deleteTodoCategory({todoCategory: category}));
		}
	}

	onSelectionChange(event: Event, selected: boolean, category: TodoCategoryDto) {
		if (selected) {
			this.filterTodosService.addCategory(category);
		} else {
			this.filterTodosService.removeCategory(category);
		}
	}
}
