import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '@pi-lot-interfaces/src/models/todo.model';

@Pipe({
	standalone: true,
	name: 'filterTodos'
})
export class FilterTodosPipe implements PipeTransform {

	transform(todos: Todo[] | null, filter: string): Todo[] {
		if (todos === null) return [] as Todo[];
		if (filter === '') return todos;
		return todos.filter(todo => todo.title.toLowerCase().includes(filter.toLowerCase()));
	}
}
