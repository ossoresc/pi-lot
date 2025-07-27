import { Todo } from "@pi-lot-interfaces/src/models/todo.model";
import { BaseDao } from "./base-dao.class";
import { TodoCategory } from "@pi-lot-interfaces/src/models/todo-category.model";
import { logger } from "../../util/logger.constant";
import { Database } from "sqlite";

export class TodoDao extends BaseDao {

	private _logger = logger.child({label: "TodoDao"});

	constructor(db: Database) {
		super(db);
	}

	async initialize() {
		await this.db.exec(`
            CREATE TABLE IF NOT EXISTS todos
            (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                title       TEXT    NOT NULL,
                done        INTEGER NOT NULL DEFAULT 0,
                date        INTEGER NOT NULL,
                description TEXT,
                lastEdited  INTEGER NOT NULL
            )
		`).catch(error => {
			this._logger.error(error);
		});

		await this.db.exec(`
            CREATE TABLE IF NOT EXISTS todo_categories
            (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                name        TEXT NOT NULL,
                description TEXT
            )
		`).catch(error => {
			this._logger.error(error);
		});

		const row = await this.db.get('SELECT COUNT(*) as count FROM todo_categories');
		if (row.count === 0) {
			const defaultCategories = [
				{name: "General", description: "A category basically for everything"},
				{name: "Personal", description: "A category for personal matters"},
				{name: "Finance", description: "A category for financial matters"},
			];

			for (const category of defaultCategories) {
				await this.db.run(`
                    INSERT INTO todo_categories (name, description)
                    VALUES (?, ?)
				`, [category.name, category.description]);
			}
		}

		await this.db.exec(`
            CREATE TABLE IF NOT EXISTS todo_j_category
            (
                todo_id     INTEGER NOT NULL,
                category_id INTEGER NOT NULL,
                PRIMARY KEY (todo_id, category_id),
                FOREIGN KEY (todo_id) REFERENCES todos (id) ON DELETE CASCADE,
                FOREIGN KEY (category_id) REFERENCES todo_categories (id) ON DELETE CASCADE
            )
		`).catch(error => {
			this._logger.error(error);
		});
	}

	async getAll(): Promise<Todo[]> {
		const rows = await this.db.all<{
			todo_id: number;
			title: string;
			done: number;
			date: number;
			description: string;
			lastEdited: number;
			category_id: number | null;
			category_name: string | null;
		}[]>(`SELECT t.id   as todo_id,
                     t.title,
                     t.done,
                     t.date,
                     t.description,
                     t.lastEdited,
                     c.id   as category_id,
                     c.name as category_name
              FROM todos t
                       LEFT JOIN todo_j_category jc ON t.id = jc.todo_id
                       LEFT JOIN todo_categories c ON jc.category_id = c.id
              ORDER BY t.id;`);

		this._logger.info(`getAll()`);

		return this.mapRowsToTodos(rows);
	}

	async getAllCategories(): Promise<TodoCategory[]> {
		return await this.db.all<TodoCategory[]>(`
            SELECT *
            FROM todo_categories
		`);
	}

	async getById(id: number): Promise<Todo | undefined> {
		const row = await this.db.get<Todo>('SELECT * FROM todos WHERE id = ?', id);
		return row ? this.mapRowsToTodos([row])[0] : undefined;
	}

	async create(todo: Todo): Promise<number> {
		this._logger.info(`before create sql: ${JSON.stringify(todo, null, 2)}`);
		const result = await this.db.run(
			'INSERT INTO todos (title, done, date, description, lastEdited) VALUES (?, ?, ?, ?, ?)',
			todo.title,
			todo.done ? 1 : 0,
			todo.date,
			todo.description,
			todo.lastEdited
		);

		if (result.lastID == undefined) {
			this._logger.error("Failed to create new todo");
			throw new Error("Failed to create new todo");
		}

		this._logger.info("create lastID (row ID):", result.lastID);

		for (let category of todo.categories) {
			this._logger.info(`inserting todo key for category: ${JSON.stringify(category, null, 2)}`);
			const categoriesResult = await this.db.run(
				'INSERT INTO todo_j_category (todo_id, category_id) VALUES (?, ?)',
				result.lastID,
				category.id
			);
			this._logger.info(`create category result: ${JSON.stringify(categoriesResult, null, 2)}`);
		}

		return result.lastID!;
	}

	async update(todo: Todo): Promise<number> {
		this._logger.info(`update() todo: ${JSON.stringify(todo, null, 2)}`);
		const result = await this.db.run(
			'UPDATE todos SET title = ?, done = ?, date = ?, description = ?, lastEdited = ? WHERE id = ?',
			todo.title,
			todo.done ? 1 : 0,
			todo.date,
			todo.description,
			todo.lastEdited,
			todo.id
		);

		this._logger.info(`update():result: ${JSON.stringify(result, null, 2)}`);

		if (result.lastID == undefined) {
			this._logger.error(`Failed to update todo: ${JSON.stringify(todo, null, 2)}`);
			throw new Error(`Failed to update todo: ${JSON.stringify(todo, null, 2)}`);
		}

		const deleteResult = await this.db.run(`
            DELETE
            FROM todo_j_category
            WHERE todo_id = ?;
		`, [todo.id]);

		this._logger.info(`Delete result: ${JSON.stringify(deleteResult, null, 2)}`);

		if (todo.categories.length > 0) {
			for (const category of todo.categories) {
				this._logger.info(`update for category of: ${JSON.stringify(category, null, 2)}`);
				await this.db.run(`
                    INSERT INTO todo_j_category (todo_id, category_id)
                    VALUES (?, ?)
				`, [todo.id, category.id]);
			}
		}

		this._logger.info(`update lastID (row ID): ${JSON.stringify(result.lastID)}`);
		return result.lastID;
	}

	async delete(id: number): Promise<boolean> {
		await this.db.run('DELETE FROM todos WHERE id = ?', id);
		// TODO check result
		return true;
	}

	async clear(): Promise<boolean> {
		await this.db.run('DELETE FROM todos WHERE done = 1', []);
		// TODO: check
		return true;
	}

	async createCategory(category: TodoCategory): Promise<number> {
		const result = await this.db.run(`INSERT INTO todo_categories (name, description)
                                          VALUES (?, ?)`, [category.name, category.description]);

		if (result.lastID == undefined) {
			this._logger.error("Failed to create new todo category");
			throw new Error("Failed to create new todo category");
		}

		return result.lastID!;
	}

	async deleteCategory(id: number): Promise<boolean> {
		await this.db.run(`DELETE FROM todo_categories WHERE id = ?`, [id]);
		await this.db.run(`DELETE FROM todo_j_category WHERE category_id = ?`, [id]);

		// TODO: check
		this._logger.info(`Deleted category with id: ${id}`);
		return true;
	}

	private mapRowsToTodos(rows: any): Todo[] {
		const todosMap = new Map<number, Todo>();

		for (const row of rows) {
			if (!todosMap.has(row.todo_id)) {
				todosMap.set(row.todo_id, {
					id: row.todo_id,
					title: row.title,
					done: !!row.done,
					date: row.date,
					description: row.description,
					lastEdited: row.lastEdited,
					categories: []
				});
			}

			const todo = todosMap.get(row.todo_id)!;

			if (row.category_id && row.category_name) {
				todo.categories.push({
					id: row.category_id,
					name: row.category_name,
					description: row.description
				});
			}
		}

		const todos: Todo[] = Array.from(todosMap.values());

		return todos;
	}
}
