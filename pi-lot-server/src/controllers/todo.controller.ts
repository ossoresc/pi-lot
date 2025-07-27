import { Body, Controller, Delete, Get, Post, Put, Route, Tags } from "tsoa";
import { Todo } from "@pi-lot-interfaces/src/models/todo.model";
import { PiLotDatabase } from "../database/pi-lot-database.class";
import { TodoDao } from "../database/dao/todo.dao";
import { TodoCategory } from "@pi-lot-interfaces/src/models/todo-category.model";
import { logger } from "../util/logger.constant";

@Route("todo")
@Tags("Todo")
export class TodoController extends Controller {

	private _logger = logger.child({ label: "TodoController" });
	private todoDao: TodoDao;

	constructor() {
		super();
		this.todoDao = PiLotDatabase.getDao(TodoDao);
	}

	@Get("/getAll")
	public async getAll(): Promise<Todo[]> {
		this._logger.info("getAll()");
		return await this.todoDao.getAll();
	}

	@Get("/getAllCategories")
	public async getAllCategories(): Promise<TodoCategory[]> {
		this._logger.info("getAllCategories()");
		return await this.todoDao.getAllCategories();
	}

	@Post("/create")
	public async create(@Body() todo: Todo): Promise<number> {
		this._logger.info("create()", JSON.stringify(todo, null, 2));
		return await this.todoDao.create(todo);
	}

	@Put("/update")
	public async update(@Body() todo: Todo): Promise<number> {
		this._logger.info("update()", JSON.stringify(todo, null, 2));
		return await this.todoDao.update(todo);
	}

	@Delete("/delete/:id")
	public async delete(id: number): Promise<boolean> {
		this._logger.info("delete()", JSON.stringify(id, null, 2));
		return await this.todoDao.delete(id);
	}

	@Post("/clear")
	public async clear(): Promise<boolean> {
		this._logger.info("clear()");
		return await this.todoDao.clear();
	}

	@Post("/createCategory")
	public async createCategory(@Body() todoCategory: TodoCategory): Promise<number> {
		return await this.todoDao.createCategory(todoCategory);
	}

	@Delete("/deleteCategory/:id")
	public async deleteCategory(id: number): Promise<boolean> {
		this._logger.info("deleteCategory()", JSON.stringify(id, null, 2));
		return await this.todoDao.deleteCategory(id);
	}
}
