import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '@pi-lot-interfaces/src/models/todo.model';
import { TodoCategory } from '@pi-lot-interfaces/src/models/todo-category.model';

@Injectable({
	providedIn: 'root'
})
export class ApiTodoService extends ApiService {

	getAllTodos(): Observable<Todo[]> {
		return this.httpClient.get<Todo[]>(this.baseUrl + "/todo/getAll");
	}

	addTodo(todo: Todo): Observable<number> {
		return this.httpClient.post<number>(this.baseUrl + "/todo/create", todo);
	}

	updateTodo(todo: Todo): Observable<Todo> {
		return this.httpClient.put<Todo>(this.baseUrl + "/todo/update", todo);
	}

	deleteTodo(id: number): Observable<boolean> {
		return this.httpClient.delete<boolean>(this.baseUrl + "/todo/delete/" + id);
	}

	clearTodos(): Observable<boolean> {
		return this.httpClient.post<boolean>(this.baseUrl + "/todo/clear", null);
	}

	getAllTodoCategories(): Observable<TodoCategory[]> {
		return this.httpClient.get<TodoCategory[]>(this.baseUrl + "/todo/getAllCategories");
	}

	addTodoCategory(todoCategory: TodoCategory): Observable<number> {
		return this.httpClient.post<number>(this.baseUrl + "/todo/createCategory", todoCategory);
	}

	deleteTodoCategory(id: number): Observable<boolean> {
		console.log("deleteTodoCategory apiservice called with id: " + id)
		return this.httpClient.delete<boolean>(this.baseUrl + "/todo/deleteCategory/" + id);
	}
}
