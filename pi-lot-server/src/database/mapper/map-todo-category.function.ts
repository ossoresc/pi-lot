import { TodoCategoryDto } from "@pi-lot-interfaces/src/dtos/todo-category.dto";
import { TodoCategoryEntity } from "../entities/todo-category.entity";

export function mapTodoCategoryToEntity(dto: TodoCategoryDto): TodoCategoryEntity {
	const entity = new TodoCategoryEntity();
	if (dto.id) entity.id = dto.id;
	entity.name = dto.name;
	entity.description = dto.description;
	// TODO: check todos of category?
	return entity;
}

export function mapTodoCategoryToDto(entity: TodoCategoryEntity): TodoCategoryDto {
	return {
		id: entity.id,
		name: entity.name,
		description: entity.description
	} as TodoCategoryDto;
}
