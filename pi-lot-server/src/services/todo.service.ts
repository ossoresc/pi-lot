import { todoRepository } from "../database/repositories/todo.repository";
import { TodoDto } from "@pi-lot-interfaces/src/dtos/todo.dto";
import { mapTodoToDto, mapTodoToEntity } from "../database/mapper/map-todo.function";

export class TodoService {

	public static async findAll(): Promise<TodoDto[]> {
		const result = await todoRepository.findAll(["categories"]);
		return result.map(entity => mapTodoToDto(entity));
	}

	public static async create(dto: TodoDto): Promise<TodoDto> {
		const entity = mapTodoToEntity(dto);
		const result = await todoRepository.create(entity);
		return mapTodoToDto(result);
	}

	public static async update(id: number, dto: TodoDto): Promise<TodoDto | null> {
		const entity = mapTodoToEntity(dto);
		const result = await todoRepository.update(id, entity);
		if (result) return mapTodoToDto(result);
		return null;
	}

	public static async delete(id: number): Promise<boolean> {
		return await todoRepository.delete(id);
	}

	public static async clear(): Promise<boolean> {
		return await todoRepository.clear();
	}
}
