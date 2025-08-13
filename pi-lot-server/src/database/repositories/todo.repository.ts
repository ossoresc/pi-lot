import { BaseRepository } from "./_base.repository";
import { TodoEntity } from "../entities/todo.entity";
import { dataSource } from "../pi-lot-datasource.constant";

export class TodoRepository extends BaseRepository<TodoEntity> {

	async clear(): Promise<boolean> {
		const result = await this.repository.delete({ done: true });
		return !!result.affected && result.affected > 0;
	}
}

export const todoRepository = new TodoRepository(dataSource, TodoEntity);
