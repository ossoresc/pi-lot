import { TEntity } from "../entities/_entities.constant";
import { DataSource, DeepPartial, EntityTarget, FindOptionsWhere, Repository } from "typeorm";

export class BaseRepository<T extends TEntity> {

	// TODO: lifecycle hooks
	// TODO: type for DeepPartial to strictly type data for create and update

	protected readonly repository: Repository<T>;

	constructor(protected dataSource: DataSource, private entity: EntityTarget<T>) {
		this.repository = dataSource.getRepository<T>(this.entity);
	}

	async findAll(relations: string[] = []): Promise<T[]> {
		return this.repository.find({ relations: relations });
	}

	async findOneById(id: number): Promise<T | null> {
		return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
	}

	// TODO: validate existing entity. save() upserts entities
	async create(data: DeepPartial<T>): Promise<T> {
		const newEntity = this.repository.create(data);
		return this.repository.save(newEntity);
	}

	async update(id: number, data: DeepPartial<T>): Promise<T | null> {
		let entity = await this.repository.findOne({
			where: { id } as FindOptionsWhere<T>,
		});
		if (!entity) return null;

		entity = this.repository.merge(entity, data);
		return await this.repository.save(entity);
	}

	async delete(id: number): Promise<boolean> {
		const result = await this.repository.delete(id);
		return !!result.affected && result.affected > 0;
	}
}
