import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { TodoEntity } from "./todo.entity";

@Entity()
export class TodoCategoryEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column()
	description!: string;

	@ManyToMany(() => TodoEntity, todoEntity => todoEntity.categories)
	todos!: TodoEntity[];
}
