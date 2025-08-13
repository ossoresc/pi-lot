import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle
} from '@angular/material/dialog';

@Component({
	selector: 'pi-lot-clear-todo-dialog',
	imports: [
		MatButton,
		MatDialogActions,
		MatDialogClose,
		MatDialogContent,
		MatDialogTitle
	],
	template: `
		<h2 mat-dialog-title>Clear Todos</h2>
		<mat-dialog-content class="content">
			<span>Are you sure, you want to delete all checked Todos?</span>
		</mat-dialog-content>
		<mat-dialog-actions>
			<button mat-button mat-dialog-close>Cancel</button>
			<button mat-button (click)="submit()">Clear</button>
		</mat-dialog-actions>
	`,
	standalone: true,
	styles: ``
})
export class ClearTodoDialogComponent {

	constructor(protected dialogRef: MatDialogRef<ClearTodoDialogComponent>) {
	}

	submit() {
		this.dialogRef.close(true);
	}
}
