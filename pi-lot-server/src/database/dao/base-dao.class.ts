import { Database } from "sqlite";

export type DaoConstructor<T extends BaseDao> = new (db: Database) => T;

export interface IBaseDao {
	initialize(): Promise<void>;
}

export abstract class BaseDao implements IBaseDao {
	protected db: Database;

	protected constructor(db: Database) {
		this.db = db;
	}

	initialize(): Promise<void> {
        throw new Error("initialize() not implemented for BaseDao.");
    }
}
