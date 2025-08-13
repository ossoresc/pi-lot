import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle
} from '@angular/material/dialog';
import { TodoDto } from '@pi-lot-interfaces/src/dtos/todo.dto';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'pi-lot-delete-todo-dialog',
	imports: [
		MatButton,
		MatDialogActions,
		MatDialogClose,
		MatDialogContent,
		MatDialogTitle,
		DatePipe
	],
	template: `
		<h2 mat-dialog-title>Delete Todo</h2>
		<mat-dialog-content class="content">
			<span>Are you sure, you want to delete this todo? This can't be undone.</span>
			<span>Title: {{ data.title }}</span>
			<span>Description: {{ data.description }}</span>
			<span>Last edited: {{ data.lastEdited | date }}</span>
		</mat-dialog-content>
		<mat-dialog-actions>
			<button mat-button mat-dialog-close>Cancel</button>
			<button mat-button (click)="submit()">Delete</button>
		</mat-dialog-actions>
	`,
	standalone: true,
	styles: `
		.content {
			display: flex;
			flex-direction: column;
			margin-top: 1rem;
		}
	`
})
export class DeleteTodoDialogComponent {
	constructor(protected dialogRef: MatDialogRef<DeleteTodoDialogComponent>,
				@Inject(MAT_DIALOG_DATA) public data: TodoDto) {
	}

	submit() {
		this.dialogRef.close(true);
	}
}
