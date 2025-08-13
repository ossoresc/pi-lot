import { Pipe, PipeTransform } from '@angular/core';
import { TodoDto } from '@pi-lot-interfaces/src/dtos/todo.dto';

@Pipe({
	standalone: true,
	name: 'filterTodos'
})
export class FilterTodosPipe implements PipeTransform {

	transform(todos: TodoDto[] | null, filter: string): TodoDto[] {
		if (todos === null) return [] as TodoDto[];
		if (filter === '') return todos;
		return todos.filter(todo => todo.title.toLowerCase().includes(filter.toLowerCase()));
	}
}
