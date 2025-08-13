import { TodoDto } from '@pi-lot-interfaces/src/dtos/todo.dto';
import { createFeature, createReducer, on } from '@ngrx/store';
import { todoActions } from '../actions/todo.actions';
import { TodoCategoryDto } from '@pi-lot-interfaces/src/dtos/todo-category.dto';

export const todoReducerKey = "todo";

export interface TodoState {
	todos: TodoDto[];
	lastUpdatedId: number | null;
	loading: boolean;
	error: string | null;
	categories: TodoCategoryDto[];
}

export const initialState: TodoState = {
	todos: [],
	lastUpdatedId: null,
	loading: false,
	error: null,
	categories: [],
};

export const todoReducer = createReducer(
	initialState,
	on(todoActions.loadTodos, (state) => {
		return {...state, loading: true};
	}),
	on(todoActions.loadTodosSuccess, (state, {todos: todos}) => {
		return {...state, todos: todos, loading: false};
	}),
	on(todoActions.loadTodosFailure, (state, {error}) => ({
		...state,
		loading: false,
		error
	})),
	on(todoActions.addTodo, (state, {todo}) => ({...state, loading: true})),
	on(todoActions.addTodoSuccess, (state, {lastCreatedId}) => {
		if (lastCreatedId != undefined) {
			return {
				...state,
				lastUpdatedId: lastCreatedId,
				loading: false
			}
		} else {
			return {
				...state,
				loading: false
			}
		}
	}),
	on(todoActions.updateTodo, (state, {todo}) => ({...state, loading: true})),
	on(todoActions.updateTodoSuccess, (state, {todo}) => {
		if (todo.id != undefined) {
			return {
				...state,
				lastUpdatedId: todo.id,
				loading: false
			}
		} else {
			return {
				...state,
				loading: false
			}
		}
	}),
	on(todoActions.updateTodoFailure, (state, {todo}) => ({...state, loading: false})),
	on(todoActions.addTodoFailure, (state, {todo}) => ({...state, loading: false})),
	on(todoActions.deleteTodo, (state, {id}) => {
		return {...state, loading: true};
	}),
	on(todoActions.deleteTodoSuccess, (state, {id}) => {
		return {
			...state,
			todos: state.todos.filter(todo => todo.id === id),
			loading: false
		};
	}),
	on(todoActions.deleteTodoFailure, (state, {id}) => {
		return {...state, loading: false};
	}),
	on(todoActions.clearTodos, (state) => {
		return {...state, loading: true};
	}),
	on(todoActions.clearTodosSuccess, (state) => {
		return {...state, loading: false};
	}),
	on(todoActions.clearTodosFailure, (state) => {
		return {...state, loading: false};
	}),
	on(todoActions.loadTodoCategories, (state) => {
		return {...state, loading: true};
	}),
	on(todoActions.loadTodoCategoriesSuccess, (state, {categories: categories}) => {
		return {...state, categories: categories, loading: false};
	}),
	on(todoActions.loadTodoCategoriesFailure, (state, {error}) => ({
		...state,
		loading: false,
		error
	})),
	on(todoActions.addTodoCategory, (state, {todoCategory}) => ({...state, loading: true})),
	on(todoActions.addTodoCategorySuccess, (state, {todoCategory}) => {
		return {
			...state,
			categories: [...state.categories, todoCategory],
		}
	}),
	on(todoActions.addTodoCategoryFailure, (state , {error}) => ({...state, loading: false})),
	on(todoActions.deleteTodoCategory, (state, {todoCategory}) => ({...state, loading: true})),
	on(todoActions.deleteTodoCategorySuccess, (state, {todoCategory}) => {
		return {
			...state,
			categories: state.categories.filter(category => category.id !== todoCategory.id),
		}
	}),
	on(todoActions.deleteTodoCategoryFailure, (state, {error}) => ({...state, loading: false}))
);

export const todoFeature = createFeature({
	name: todoReducerKey,
	reducer: todoReducer
});
