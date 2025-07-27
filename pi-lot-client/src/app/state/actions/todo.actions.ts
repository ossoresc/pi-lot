import { createAction, props } from '@ngrx/store';
import { Todo } from '@pi-lot-interfaces/src/models/todo.model';
import { TodoCategory } from '@pi-lot-interfaces/src/models/todo-category.model';

export const loadTodos = createAction('[Todos] Load Todos');

export const loadTodosSuccess = createAction(
	'[Todos] Load Todos Success',
	props<{ todos: Todo[] }>()
);

export const loadTodosFailure = createAction(
	'[Todos] Load Todos Failure',
	props<{ error: string }>()
);

export const addTodo = createAction(
	'[Todos] Add Todo',
	props<{ todo: Todo }>()
);

export const addTodoSuccess = createAction(
	'[Todos] Add Todo Success',
	props<{ lastCreatedId: number }>()
);

export const addTodoFailure = createAction(
	'[Todos] Add Todo Failure',
	props<{ todo: Todo }>()
);

export const updateTodo = createAction(
	'[Todos] Update Todo',
	props<{ todo: Todo }>()
);

export const updateTodoSuccess = createAction(
	'[Todos] Update Todo Success',
	props<{ todo: Todo }>()
);

export const updateTodoFailure = createAction(
	'[Todos] Update Todo Failure',
	props<{ todo: Todo }>()
);

export const deleteTodo = createAction(
	'[Todos] Delete Todo',
	props<{ id: number }>()
);

export const deleteTodoSuccess = createAction(
	'[Todos] Delete Todo Success',
	props<{ id: number }>()
);

export const deleteTodoFailure = createAction(
	'[Todos] Delete Todo Failure',
	props<{ id: number }>()
);

export const clearTodos = createAction(
	'[Todos] Clear Todos'
);

export const clearTodosSuccess = createAction(
	'[Todos] Clear Todos Success'
);

export const clearTodosFailure = createAction(
	'[Todos] Clear Todos Failure'
);

export const loadTodoCategories = createAction('[Todos] Load Todo Categories');

export const loadTodoCategoriesSuccess = createAction(
	'[Todos] Load Todo Categories Success',
	props<{ categories: TodoCategory[] }>()
);

export const loadTodoCategoriesFailure = createAction(
	'[Todos] Load Todo Categories Failure',
	props<{ error: string }>()
);

export const addTodoCategory = createAction(
	'[Todos] Add Todo Category',
	props<{ todoCategory: TodoCategory }>()
);

export const addTodoCategorySuccess = createAction(
	'[Todos] Add Todo Category Success',
	props<{ todoCategory: TodoCategory }>()
);

export const addTodoCategoryFailure = createAction(
	'[Todos] Add Todo Category Failure',
	props<{ error: string }>()
);

export const deleteTodoCategory = createAction(
	'[Todos] Delete Todo Category',
	props<{ todoCategory: TodoCategory }>()
);

export const deleteTodoCategorySuccess = createAction(
	'[Todos] Delete Todo Category Success',
	props<{ todoCategory: TodoCategory }>()
);

export const deleteTodoCategoryFailure = createAction(
	'[Todos] Delete Todo Category Failure',
	props<{ error: string }>()
);

export const todoActions = {
	loadTodos,
	loadTodosSuccess,
	loadTodosFailure,
	addTodo,
	addTodoSuccess,
	addTodoFailure,
	updateTodo,
	updateTodoSuccess,
	updateTodoFailure,
	deleteTodo,
	deleteTodoSuccess,
	deleteTodoFailure,
	clearTodos,
	clearTodosSuccess,
	clearTodosFailure,
	loadTodoCategories,
	loadTodoCategoriesSuccess,
	loadTodoCategoriesFailure,
	addTodoCategory,
	addTodoCategorySuccess,
	addTodoCategoryFailure,
	deleteTodoCategory,
	deleteTodoCategorySuccess,
	deleteTodoCategoryFailure,
}
