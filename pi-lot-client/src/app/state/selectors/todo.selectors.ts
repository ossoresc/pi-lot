import { todoFeature } from '../reducers/todo.reducer';
import { createSelector } from '@ngrx/store';

export const selectTodosLoading = createSelector(
	todoFeature.selectTodoState,
	(state) => state.loading
);

export const selectTodoById = (id: number) => createSelector(
	todoFeature.selectTodoState,
	(state) => state.todos.find(t => t.id === id)
);

export const selectLastUpdatedTodo = createSelector(
	todoFeature.selectTodoState,
	todoFeature.selectLastUpdatedId,
	(state, lastId) => state.todos.find(t => t.id === lastId)
);

export const selectCategoriesForTodo = (id: number) => createSelector(
	todoFeature.selectTodoState,
	(state) => {
		const todo = state.todos.find(t => t.id === id);

		if (todo) {
			return todo.categories;
		} else {
			return [];
		}
	}
)
