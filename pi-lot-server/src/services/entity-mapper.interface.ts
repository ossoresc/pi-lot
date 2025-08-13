import { TEntity } from "../database/entities/_entities.constant";

// TODO: dto type
export interface EntityMapper<D, E extends TEntity> {
	mapDtoToEntity(dto: D): E;
	mapEntityToDto(entity: E): D;
}
