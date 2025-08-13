import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoDto } from '@pi-lot-interfaces/src/dtos/todo.dto';
import { TodoCategoryDto } from '@pi-lot-interfaces/src/dtos/todo-category.dto';

@Injectable({
	providedIn: 'root'
})
export class ApiTodoService extends ApiService {

	getAllTodos(): Observable<TodoDto[]> {
		return this.httpClient.get<TodoDto[]>(this.baseUrl + "/todo/getAll");
	}

	createTodo(todo: TodoDto): Observable<number> {
		return this.httpClient.post<number>(this.baseUrl + "/todo/create", todo);
	}

	updateTodo(todo: TodoDto): Observable<TodoDto> {
		return this.httpClient.put<TodoDto>(this.baseUrl + `/todo/update/${todo.id}`, todo);
	}

	deleteTodo(id: number): Observable<boolean> {
		return this.httpClient.delete<boolean>(this.baseUrl + "/todo/delete/" + id);
	}

	clearTodos(): Observable<boolean> {
		return this.httpClient.post<boolean>(this.baseUrl + "/todo/clear", null);
	}

	getAllTodoCategories(): Observable<TodoCategoryDto[]> {
		return this.httpClient.get<TodoCategoryDto[]>(this.baseUrl + "/todo/getAllCategories");
	}

	addTodoCategory(todoCategory: TodoCategoryDto): Observable<number> {
		return this.httpClient.post<number>(this.baseUrl + "/todo/createCategory", todoCategory);
	}

	deleteTodoCategory(id: number): Observable<boolean> {
		console.log("deleteTodoCategory apiservice called with id: " + id)
		return this.httpClient.delete<boolean>(this.baseUrl + "/todo/deleteCategory/" + id);
	}
}
