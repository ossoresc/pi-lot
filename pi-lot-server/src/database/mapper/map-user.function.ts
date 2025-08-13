import { UserDto } from "@pi-lot-interfaces/src/dtos/user.dto";
import { UserEntity } from "../entities/user.entity";

export function mapUserToEntity(dto: UserDto): UserEntity {
	const entity = new UserEntity();
	if (dto.id) entity.id = dto.id;
	entity.name = dto.name;
	return entity;
}

export function mapUserToDto(entity: UserEntity): UserDto {
	return {
		id: entity.id,
		name: entity.name
	} as UserDto;
}
