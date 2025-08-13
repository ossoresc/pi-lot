import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { todoActions } from '../actions/todo.actions';
import { catchError, mergeMap, of, switchMap } from 'rxjs';
import { ApiTodoService } from '../../services/api/api-todo.service';

@Injectable()
export class TodoEffects {
	private actions$ = inject(Actions);
	private todoApiService = inject(ApiTodoService);

	loadTodos$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(todoActions.loadTodos),
			switchMap(() => this.todoApiService.getAllTodos()
				.pipe(
					switchMap((todos) => [
						todoActions.loadTodosSuccess({todos})
					]),
					catchError(() => of(todoActions.loadTodosFailure))
				))
		);
	});

	addTodo$ = createEffect(() =>
		this.actions$.pipe(
			ofType(todoActions.addTodo),
			mergeMap(({todo}) =>
				this.todoApiService.createTodo(todo).pipe(
					switchMap((lastCreatedId) => {
						return [
							todoActions.addTodoSuccess({lastCreatedId}),
							todoActions.loadTodos()
						];
					}),
					catchError(() => of(todoActions.addTodoFailure({todo})))
				)
			)
		)
	);

	updateTodo$ = createEffect(() =>
		this.actions$.pipe(
			ofType(todoActions.updateTodo),
			mergeMap(action => {
					if (action.todo == null || action.todo.id == undefined)
						return of(todoActions.updateTodoFailure({todo: action.todo}));

					return this.todoApiService.updateTodo(action.todo).pipe(
						switchMap(response => [
							todoActions.updateTodoSuccess({todo: action.todo}),
							todoActions.loadTodos()
						]),
						catchError(error => of(todoActions.updateTodoFailure({todo: action.todo})))
					);
				}
			)
		)
	);

	deleteTodo$ = createEffect(() =>
		this.actions$.pipe(
			ofType(todoActions.deleteTodo),
			mergeMap(({id}) =>
				this.todoApiService.deleteTodo(id).pipe(
					switchMap(() => [
						todoActions.deleteTodoSuccess({id}),
						todoActions.loadTodos()
					]),
					catchError(() => of(todoActions.deleteTodoFailure))
				)
			)
		)
	);

	clear$Todos = createEffect(() =>
		this.actions$.pipe(
			ofType(todoActions.clearTodos),
			mergeMap(() =>
				this.todoApiService.clearTodos().pipe(
					switchMap((success) => [
						success ? todoActions.clearTodosSuccess() : todoActions.clearTodosFailure(),
						todoActions.loadTodos()
					]),
					catchError(() => of(todoActions.clearTodosFailure()))
				)
			)
		)
	);

	loadTodoCategories$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(todoActions.loadTodoCategories),
			switchMap(() => this.todoApiService.getAllTodoCategories()
				.pipe(
					switchMap((categories) => [
						todoActions.loadTodoCategoriesSuccess({categories})
					]),
					catchError(() => of(todoActions.loadTodoCategoriesFailure))
				))
		);
	});

	addTodoCategory$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(todoActions.addTodoCategory),
			switchMap((action) => this.todoApiService.addTodoCategory(action.todoCategory)
				.pipe(
					switchMap((categoryId) => [
						todoActions.addTodoCategorySuccess({todoCategory: { ...action.todoCategory, id: categoryId }}),
						todoActions.loadTodoCategories(),
						todoActions.loadTodos()
					]),
					catchError((error) => of(todoActions.addTodoCategoryFailure({error})))
				))
		)
	})

	deleteTodoCategory$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(todoActions.deleteTodoCategory),
			switchMap((action) => {
				if (action.todoCategory.id == null) {
					return of(todoActions.deleteTodoCategoryFailure({error: "TodoCategory ID is null"}));
				}

				console.log("delete todo effect")

				return this.todoApiService.deleteTodoCategory(action.todoCategory.id)
				.pipe(
					switchMap((success) => [
						todoActions.deleteTodoCategorySuccess({todoCategory: action.todoCategory}),
						todoActions.loadTodoCategories(),
						todoActions.loadTodos()
					]),
					catchError((error) => of(todoActions.deleteTodoCategoryFailure({error})))
				)})
		)
	})
}
