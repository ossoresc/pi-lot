import { Injectable } from '@angular/core';
import { TodoCategory } from '@pi-lot-interfaces/src/models/todo-category.model';
import { Todo } from '@pi-lot-interfaces/src/models/todo.model';

@Injectable({
	providedIn: 'root'
})
export class FilterTodosService {

	private selectedCategories: TodoCategory[] = [];

	constructor() {
	}

	filter(todos: Todo[]): Todo[] {
		if (todos === null) return [];
		if (todos.length === 0) return [];
		if (this.selectedCategories.length === 0) return todos;

		const filtered = todos.filter(todo => {
			const todoCategories = todo.categories;

			if (this.selectedCategories.length === 0) {
				return true;
			}

			for (const category of this.selectedCategories) {
				if (todoCategories.some(cat => cat.id === category.id)) {
					return true;
				}
			}

			return false;
		});

		return filtered;
	}

	getSelectedCategories(): TodoCategory[] {
		return this.selectedCategories;
	}

	getSelectedCategoriesLength(): number {
		return this.selectedCategories.length;
	}

	setSelectedCategories(categories: TodoCategory[]) {
		this.selectedCategories = categories;
	}

	clearSelectedCategories() {
		this.selectedCategories = [];
	}

	addCategory(category: TodoCategory) {
		this.selectedCategories.push(category);
	}

	removeCategory(category: TodoCategory) {
		this.selectedCategories = this.selectedCategories.filter(cat => cat.id !== category.id);
	}

	hasSelectedCategories(): boolean {
		return this.selectedCategories.length > 0;
	}

	hasCategory(category: TodoCategory): boolean {
		return this.selectedCategories.some(cat => cat.id === category.id);
	}

	hasCategoryWithName(name: string): boolean {
		return this.selectedCategories.some(cat => cat.name === name);
	}

	hasCategoryWithDescription(description: string): boolean {
		return this.selectedCategories.some(cat => cat.description === description);
	}
}
