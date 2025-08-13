import { Component, Inject, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
	FormArray,
	FormControl,
	FormGroup,
	NonNullableFormBuilder,
	ReactiveFormsModule,
	Validators
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { TodoDialogCategoryFormGroup, TodoDialogFormGroup, TodoDialogResult } from './todo-dialog-result.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TodoDto } from '@pi-lot-interfaces/src/dtos/todo.dto';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { todoFeature } from '../../../state/reducers/todo.reducer';
import { TodoCategoryDto } from '@pi-lot-interfaces/src/dtos/todo-category.dto';
import { TodoCategoryDialogComponent } from '../todo-category-dialog/todo-category-dialog.component';

@Component({
	selector: 'pi-lot-todo-dialog',
	imports: [
		MatDialogModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		ReactiveFormsModule,
		MatNativeDateModule,
		NgIf,
		MatIconModule,
		MatTooltipModule,
		MatCheckboxModule,
		MatExpansionModule,
		MatChipsModule,
		NgForOf,
		AsyncPipe,
		DatePipe
	],
	template: `
		<h2 mat-dialog-title>{{ dialogTitle() }}</h2>

		<mat-dialog-content>
			<form [formGroup]="formGroup" class="content">
				<mat-form-field hintLabel="" cdkFocusInitial appearance="outline">
					<mat-label>Enter todo title</mat-label>
					<input matInput #input formControlName="title" placeholder="e.g. Groceries"
						   [value]="formGroup.controls.title.value"/>
					<mat-hint align="end"></mat-hint>
				</mat-form-field>

				<mat-form-field appearance="outline">
					<mat-label>Choose a date</mat-label>
					<input matInput [matDatepicker]="picker" formControlName="date">
					<mat-hint>DD.MM.YYYY</mat-hint>
					<div class="calendar-actions" matIconSuffix>
						<mat-datepicker-toggle  [for]="picker"></mat-datepicker-toggle>
						<button mat-icon-button (click)="setToday()" matTooltip="Set to today">
							<mat-icon>update</mat-icon>
						</button>
					</div>
					<mat-datepicker #picker></mat-datepicker>

					<mat-error *ngIf="formGroup.controls.date.hasError('required')">
						Date is required
					</mat-error>
					<mat-error *ngIf="formGroup.controls.date.invalid && !formGroup.controls.date.hasError('required')">
						Invalid Date
					</mat-error>
				</mat-form-field>

				<mat-expansion-panel>
					<mat-expansion-panel-header>
						<mat-panel-title>
							Category:
						</mat-panel-title>
						<mat-panel-description>
							{{ categories.length }}
						</mat-panel-description>
					</mat-expansion-panel-header>

					<mat-chip-set>
						<mat-chip-option *ngFor="let category of categories$ | async; let i = index;"
										 [selected]="isSelectedCategory(category)"
										 (click)="onCategoryToggle(category, i)"
										 [matTooltip]="category.description">
							{{ category.name }}
						</mat-chip-option>

						<mat-chip-option selectable="false" (click)="onAddNewCategoryClick()">
							<mat-icon matChipAvatar>add</mat-icon>
							Add Category
						</mat-chip-option>
					</mat-chip-set>
				</mat-expansion-panel>

				<mat-form-field appearance="outline" class="ff-description">
					<mat-label>Enter a description</mat-label>
					<textarea matInput formControlName="description"
							  placeholder="e.g. Don't forget the bananas"
							  [value]="formGroup.controls.description.value"></textarea>
				</mat-form-field>

				<div>
					<mat-label>Done</mat-label>
					<mat-checkbox formControlName="done" #doneCheckbox [checked]="formGroup.controls.done.value"></mat-checkbox>
				</div>
			</form>
		</mat-dialog-content>

		<mat-dialog-actions>
			<button mat-button mat-dialog-close>Cancel</button>
			<button mat-button (click)="onSubmitButtonClick()">{{ dialogTitle() }}</button>
		</mat-dialog-actions>
	`,
	standalone: true,
	styles: `
		.content {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			margin: 1rem;

			.ff-description {
				flex: 1 1 auto;
				display: flex;
				flex-direction: column;

				textarea {
					flex: 1 1 auto;
					resize: none;
					height: 10rem;
				}
			}
		}

		.calendar-actions {
			display: flex;
			flex-direction: row;
		}
	`
})
export class TodoDialogComponent {

	private readonly store = inject(Store);
	private readonly dialog = inject(MatDialog);
	private readonly snackBar = inject(MatSnackBar);

	protected readonly dialogTitle = signal('');
	protected readonly categories$ = this.store.select(todoFeature.selectCategories);

	protected formGroup: FormGroup<TodoDialogFormGroup>;
	protected TODO_ID: number | undefined;

	constructor(
		private fb: NonNullableFormBuilder,
		private dialogRef: MatDialogRef<TodoDialogComponent, TodoDialogResult>,
		@Inject(MAT_DIALOG_DATA) public data: TodoDto | null
	) {
		let editTodo: TodoDto;
		if (this.data != null) {
			this.dialogTitle.set("Edit Todo");

			editTodo = this.data;
		} else {
			this.dialogTitle.set("Add new Todo");

			editTodo = {
				id: undefined,
				title: "",
				date: new Date(),
				done: false,
				description: "",
				categories: [],
				lastEdited: new Date()
			} as TodoDto;
		}

		this.TODO_ID = editTodo.id;

		this.formGroup = this.fb.group<TodoDialogFormGroup>({
			title: this.fb.control(editTodo.title, Validators.required),
			date: this.fb.control(new Date(editTodo.date), Validators.required),
			description: this.fb.control(editTodo.description),
			done: this.fb.control(editTodo.done, Validators.required),
			lastEdited: this.fb.control(new Date(editTodo.lastEdited), Validators.required),
			categories: this.fb.array<TodoDialogCategoryFormGroup>([]),
		});

		for (let category of editTodo.categories) {
			// TODO: necessary?
			if (category.id == undefined) {
				this.snackBar.open(`Category without ID found: ${category.name}`, "Close", {duration: 3000});
				continue;
			}

			const categoryForm = this.fb.control<TodoDialogCategoryFormGroup>({
				id: this.fb.control(category.id, Validators.required),
				name: this.fb.control(category.name, Validators.required),
				description: this.fb.control(category.description, Validators.required),
			});

			// TODO null check?
			if (categoryForm != null) {
				this.formGroup.controls.categories.push(categoryForm);
			}
		}
	}

	protected onSubmitButtonClick() {
		if (!this.formGroup.controls.title.valid || this.formGroup.value.title === undefined) {
			this.snackBar.open("Invalid title", "Close", {duration: 3000});
			return;
		}

		if (!this.formGroup.controls.date.valid || this.formGroup.value.date === null || this.formGroup.value.date === undefined) {
			this.snackBar.open("Invalid date", "Close", {duration: 3000});
			return;
		}

		if (!this.formGroup.controls.description.valid || this.formGroup.value.description === null || this.formGroup.value.description === undefined) {
			this.snackBar.open("Invalid description", "Close", {duration: 3000});
			return;
		}

		if (!this.formGroup.controls.done.valid || this.formGroup.value.done === null || this.formGroup.value.done === undefined) {
			this.snackBar.open("Invalid done", "Close", {duration: 3000});
			return;
		}

		if (!this.formGroup.controls.categories.valid || this.formGroup.controls.categories.value === null || this.formGroup.controls.categories.value === undefined) {
			this.snackBar.open("Invalid categories", "Close", {duration: 3000});
			return;
		}

		const resultCategories: TodoCategoryDto[] = this.categories.value.map(catGrp => {
			return {
				id: catGrp.id.value,
				name: catGrp.name.value,
				description: catGrp.description.value
			} as TodoCategoryDto;
		})

		const result: TodoDialogResult = {
			id: this.TODO_ID,
			title: this.formGroup.value.title,
			date: this.formGroup.value.date,
			description: this.formGroup.value.description,
			done: this.formGroup.value.done,
			lastEdited: new Date(), // TODO: lastEdited mechanism ?
			categories: resultCategories
		}

		if (this.formGroup.valid) {
			this.dialogRef.close(result);
		} else {
			this.snackBar.open("Invalid values", "Close", {duration: 3000});
		}
	}

	protected setToday() {
		this.formGroup.controls.date.setValue(new Date());
	}

	onCategoryToggle(category: TodoCategoryDto, index: number) {
		if (category.id == undefined) {
			this.snackBar.open(`Category without ID found: ${category.name}`, "Close", {duration: 3000});
			return;
		}

		const categoryCtrl = this.fb.control<TodoDialogCategoryFormGroup>({
			id: this.fb.control(category.id, Validators.required),
			name: this.fb.control(category.name, Validators.required),
			description: this.fb.control(category.description, Validators.required),
		});

		const foundIndex = this.categories.controls.findIndex(ctrl => ctrl.value.id.value === category.id);

		if (foundIndex === -1) {
			this.categories.push(categoryCtrl);
		} else {
			this.categories.removeAt(foundIndex);
		}
	}

	get categories(): FormArray<FormControl<TodoDialogCategoryFormGroup>> {
		return this.formGroup.controls.categories as FormArray<FormControl<TodoDialogCategoryFormGroup>>;
	}

	isSelectedCategory(todoCategory: TodoCategoryDto): boolean {
		const res = this.categories.controls.find(ctrl => {
			return ctrl.value.id.value == todoCategory.id;
		});
		return res != undefined;
	}

	onAddNewCategoryClick() {
		this.dialog.open(TodoCategoryDialogComponent);
	}
}
