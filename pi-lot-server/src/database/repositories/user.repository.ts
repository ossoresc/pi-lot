import { BaseRepository } from "./_base.repository";
import { UserEntity } from "../entities/user.entity";
import { dataSource } from "../pi-lot-datasource.constant";

export class UserRepository extends BaseRepository<UserEntity> {
}

export const userRepository = new UserRepository(dataSource, UserEntity);
