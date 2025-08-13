import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { PiLotBaseEntity } from "./_pi-lot-base.entity";
import { TodoCategoryEntity } from "./todo-category.entity";

@Entity()
export class TodoEntity extends PiLotBaseEntity {

	@Column()
	title!: string;

	@Column()
	done!: boolean;

	@Column()
	date!: Date;

	@Column()
	description!: string;

	@ManyToMany(() => TodoCategoryEntity, todoCategory => todoCategory.todos, {
		cascade: true,
	})
	@JoinTable()
	categories!: TodoCategoryEntity[];
}
