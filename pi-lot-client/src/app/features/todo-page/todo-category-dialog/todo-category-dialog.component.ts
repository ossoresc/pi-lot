import { Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
	FormControl,
	FormGroup,
	NonNullableFormBuilder,
	ReactiveFormsModule,
	Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { todoActions } from '../../../state/actions/todo.actions';
import { TodoCategoryDto } from '@pi-lot-interfaces/src/dtos/todo-category.dto';

interface TodoCategoryDialogFormGroup {
	name: FormControl<string>;
	description: FormControl<string>;
}

@Component({
	selector: 'pi-lot-todo-category-dialog',
	imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
	template: `
		<h2 mat-dialog-title>{{ dialogTitle() }}</h2>
		<mat-dialog-content>
			<form [formGroup]="formGroup" class="content">
				<mat-form-field appearance="outline">
					<mat-label>Category name</mat-label>
					<input matInput cdkFocusInitial="true" formControlName="name"
						   [value]="formGroup.controls.name.value">
				</mat-form-field>

				<mat-form-field appearance="outline" class="ff-description">
					<mat-label>Category description</mat-label>
					<textarea matInput formControlName="description"
							  [value]="formGroup.controls.description.value"></textarea>
				</mat-form-field>
			</form>
		</mat-dialog-content>
		<mat-dialog-actions align="end">
			<button mat-button matDialogClose>Cancel</button>
			<button mat-button (click)="onCreateClick()">Create</button>
		</mat-dialog-actions>
	`,
	styles: `
		.content {
			display: flex;
			flex-direction: column;
			padding-top: 0.5rem;
		}

		.ff-description {

			textarea {
				resize: none;
			}
		}
	`
})
export class TodoCategoryDialogComponent {
	protected readonly dialogTitle = signal('Add todo category');
	protected formGroup: FormGroup<TodoCategoryDialogFormGroup>;

	private readonly dialogRef = inject(MatDialogRef<TodoCategoryDialogComponent, TodoCategoryDto>);

	constructor(
		private fb: NonNullableFormBuilder,
		private snackbar: MatSnackBar,
		private store: Store
	) {
		this.formGroup = fb.group({
			name: fb.control("", [Validators.required]),
			description: fb.control("", [Validators.required])
		});
	}

	onCreateClick() {
		if (this.formGroup.invalid) {
			this.snackbar.open("Name and description are required", "Close", {duration: 3000});
			return;
		}

		const todoCategory: TodoCategoryDto = {
			name: this.formGroup.controls.name.value,
			description: this.formGroup.controls.description.value
		}

		this.store.dispatch(todoActions.addTodoCategory({todoCategory: todoCategory}));
		this.dialogRef.close();
	}
}
