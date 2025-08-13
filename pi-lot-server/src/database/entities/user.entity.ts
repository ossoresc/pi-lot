import { Column, Entity } from "typeorm";
import { PiLotBaseEntity } from "./_pi-lot-base.entity";

@Entity()
export class UserEntity extends PiLotBaseEntity {

	@Column()
	name!: string;

	@Column()
	password!: string;
}
