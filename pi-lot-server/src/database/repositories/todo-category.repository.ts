import { BaseRepository } from "./_base.repository";
import { TodoCategoryEntity } from "../entities/todo-category.entity";
import { dataSource } from "../pi-lot-datasource.constant";

export class TodoCategoryRepository extends BaseRepository<TodoCategoryEntity> {
}

export const todoCategoryRepository = new TodoCategoryRepository(dataSource, TodoCategoryEntity);
