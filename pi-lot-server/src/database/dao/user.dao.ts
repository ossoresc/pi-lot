
import { BaseDao } from "./base-dao.class";
import { logger } from "../../util/logger.constant";
import { LoginData } from "@pi-lot-interfaces/src/models/login-data.model";
import { User } from "@pi-lot-interfaces/src/models/user.model";
import { Database } from "sqlite";

export class UserDao extends BaseDao {

	private _logger = logger.child({ label: "UserDao" });

	constructor(db: Database) {
		super(db);
	}

	async initialize() {
		await this.db.exec(`
            CREATE TABLE IF NOT EXISTS users
            (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                name       TEXT    NOT NULL,
                password        TEXT NOT NULL
            )
		`).catch(error => {
			this._logger.error(error);
		});
	}

	async login(loginData: LoginData): Promise<User | undefined> {
		const row = await this.db.get<User>(`SELECT * FROM users WHERE name = ? AND password = ?`,
			loginData.username,
			loginData.password);
		// TODO: validation?
		return row ? this.mapRowsToUsers([row])[0] : undefined;
	}

	private mapRowsToUsers(rows: any): User[] {
		const users: User[] = [];
		for (const row of rows) {
			users.push({
				id: row.id,
				name: row.name
			});
		}
		return users;
	}
}
