import { TodoCategoryDto } from "./todo-category.dto";

export interface TodoDto {
	id?: number;
	title: string;
	done: boolean;
	date: Date;
	description: string;
	lastEdited: Date;
	categories: TodoCategoryDto[];
}
