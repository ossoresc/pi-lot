import { userRepository } from "../database/repositories/user.repository";
import { UserDto } from "@pi-lot-interfaces/src/dtos/user.dto";
import { mapUserToDto, mapUserToEntity } from "../database/mapper/map-user.function";

export class UserService {

	public static async findAll() {
		const result = await userRepository.findAll();
		return result.map(entity => mapUserToDto(entity));
	}

	public static async findOne(id: number): Promise<UserDto | null> {
		const entity = await userRepository.findOneById(id);
		if (entity) return mapUserToDto(entity);
		return null;
	}

	public static async create(dto: UserDto): Promise<UserDto> {
		const entity = mapUserToEntity(dto);
		const result = await userRepository.create(entity);
		return mapUserToDto(result);
	}

	public static async update(id: number, dto: UserDto): Promise<UserDto | null> {
		const entity = mapUserToEntity(dto);
		const result = await userRepository.update(id, entity);
		if (result) return mapUserToDto(result);
		return null;
	}

	public static async delete(id: number): Promise<boolean> {
		return await userRepository.delete(id);
	}
}
