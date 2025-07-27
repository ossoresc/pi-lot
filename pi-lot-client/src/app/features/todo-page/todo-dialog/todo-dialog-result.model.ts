import { FormArray, FormControl } from '@angular/forms';
import { TodoCategory } from '@pi-lot-interfaces/src/models/todo-category.model';

export interface TodoDialogFormGroup {
	title: FormControl<string>,
	date: FormControl<Date>
	description: FormControl<string>,
	done: FormControl<boolean>,
	lastEdited: FormControl<Date>
	categories: FormArray<FormControl<TodoDialogCategoryFormGroup>>
}

export interface TodoDialogCategoryFormGroup {
	id: FormControl<number>;
	name: FormControl<string>;
	description: FormControl<string>;
}

export interface TodoDialogResult {
	id?: number;
	title: string;
	date: Date;
	description: string;
	done: boolean;
	lastEdited: Date;
	categories: TodoCategory[];
}
