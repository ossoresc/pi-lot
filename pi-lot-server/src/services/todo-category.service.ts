import { todoCategoryRepository } from "../database/repositories/todo-category.repository";
import { TodoCategoryDto } from "@pi-lot-interfaces/src/dtos/todo-category.dto";
import { mapTodoCategoryToDto, mapTodoCategoryToEntity } from "../database/mapper/map-todo-category.function";

export class TodoCategoryService {

	public static async findAll() {
		return await todoCategoryRepository.findAll();
	}

	public static async create(dto: TodoCategoryDto) {
		const entity = mapTodoCategoryToEntity(dto);
		const result = await todoCategoryRepository.create(entity);
		return mapTodoCategoryToDto(result);
	}

	public static async delete(id: number) {
		return await todoCategoryRepository.delete(id);
	}
}
