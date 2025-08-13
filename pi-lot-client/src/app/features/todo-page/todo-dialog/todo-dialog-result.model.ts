import { FormArray, FormControl } from '@angular/forms';
import { TodoCategoryDto } from '@pi-lot-interfaces/src/dtos/todo-category.dto';

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
	categories: TodoCategoryDto[];
}
