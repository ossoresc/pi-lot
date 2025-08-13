import { Injectable } from '@angular/core';
import { TodoCategoryDto } from '@pi-lot-interfaces/src/dtos/todo-category.dto';
import { TodoDto } from '@pi-lot-interfaces/src/dtos/todo.dto';

@Injectable({
	providedIn: 'root'
})
export class FilterTodosService {

	private selectedCategories: TodoCategoryDto[] = [];

	constructor() {
	}

	filter(todos: TodoDto[]): TodoDto[] {
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

	getSelectedCategories(): TodoCategoryDto[] {
		return this.selectedCategories;
	}

	getSelectedCategoriesLength(): number {
		return this.selectedCategories.length;
	}

	setSelectedCategories(categories: TodoCategoryDto[]) {
		this.selectedCategories = categories;
	}

	clearSelectedCategories() {
		this.selectedCategories = [];
	}

	addCategory(category: TodoCategoryDto) {
		this.selectedCategories.push(category);
	}

	removeCategory(category: TodoCategoryDto) {
		this.selectedCategories = this.selectedCategories.filter(cat => cat.id !== category.id);
	}

	hasSelectedCategories(): boolean {
		return this.selectedCategories.length > 0;
	}

	hasCategory(category: TodoCategoryDto): boolean {
		return this.selectedCategories.some(cat => cat.id === category.id);
	}

	hasCategoryWithName(name: string): boolean {
		return this.selectedCategories.some(cat => cat.name === name);
	}

	hasCategoryWithDescription(description: string): boolean {
		return this.selectedCategories.some(cat => cat.description === description);
	}
}
