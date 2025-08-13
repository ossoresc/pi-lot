import { TodoDto } from "@pi-lot-interfaces/src/dtos/todo.dto";
import { TodoEntity } from "../entities/todo.entity";
import { mapTodoCategoryToDto, mapTodoCategoryToEntity } from "./map-todo-category.function";

export function mapTodoToEntity(dto: TodoDto): TodoEntity {
	const entity = new TodoEntity();
	if (dto.id) {
		entity.id = dto.id;
	}
	entity.title = dto.title;
	entity.done = dto.done;
	entity.date = dto.date;
	entity.description = dto.description;
	entity.updatedAt = dto.lastEdited;
	entity.categories = dto.categories ? dto.categories.map(categoryDto => mapTodoCategoryToEntity(categoryDto)) : [];
	return entity;
}

export function mapTodoToDto(entity: TodoEntity): TodoDto {
	return {
		id: entity.id,
		title: entity.title,
		done: entity.done,
		date: entity.date,
		description: entity.description,
		lastEdited: entity.updatedAt,
		categories: entity.categories ? entity.categories.map(categoryEntity => mapTodoCategoryToDto(categoryEntity)) : []
	} as TodoDto;
}
