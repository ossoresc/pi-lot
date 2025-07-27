import { TodoCategory } from "./todo-category.model";

export interface Todo {
	id?: number;
	title: string;
	done: boolean;
	date: number;
	description: string;
	lastEdited: number;
	categories: TodoCategory[];
}
