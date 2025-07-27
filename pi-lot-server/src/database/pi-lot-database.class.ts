import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import path from "path";
import { TodoDao } from "./dao/todo.dao";
import { BaseDao, DaoConstructor } from "./dao/base-dao.class";
import { logger } from "../util/logger.constant";
import { UserDao } from "./dao/user.dao";

export class PiLotDatabase {

	private static _logger = logger.child({ label: "PiLotDatabase" });

	private static db: Database | null = null;
	private static daoMap = new Map<string, BaseDao>;

	public static async createDatabase(): Promise<Database> {
		if (this.db != null){
			this._logger.warn("PiLotDatabase already created. Consider removing multiple createDatabase() executions");
			return this.db;
		}

		this.db = await open({
			filename: path.resolve(__dirname, "./pi-lot.db"),
			driver: sqlite3.Database
		}).then((res) => {
			this._logger.info("DB successfully created");
			return res;
		}).catch((error) => {
			this._logger.error(`Error while opening DB: ${error}`);
			return null;
		});

		if (this.db === null) throw new Error("Failed to create database");

		// DAOs
		await this.registerDao(TodoDao, this.db);
		await this.registerDao(UserDao, this.db);

		return this.db
	}

	public static getDao<T extends BaseDao>(daoClass: DaoConstructor<T>): T {
		if (this.db == null) {
			this._logger.error("getDao DB is null");
			throw new Error("getDao DB is null");
		}

		const dao = this.daoMap.get(daoClass.name);
		if (!dao) {
			throw new Error(`DAO ${daoClass.name} is not registered.`);
		}
		return dao as T;
	}

	private static async registerDao<T extends BaseDao>(daoClass: DaoConstructor<T>, db: Database) {
		const name = daoClass.name;
		if (!this.daoMap.has(name)) {
			const dao = new daoClass(db);
			await dao.initialize();
			this.daoMap.set(name, dao);
		}
	}
}

