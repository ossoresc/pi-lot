import { UserEntity } from "./user.entity";
import { TodoEntity } from "./todo.entity";
import { TodoCategoryEntity } from "./todo-category.entity";

export type EntityConstructor = typeof entities[number];
export type TEntity = InstanceType<EntityConstructor>;

export const entities = [
	UserEntity,
	TodoEntity,
	TodoCategoryEntity
] as const;
