import { Body, Controller, Delete, Get, Path, Post, Put, Route, Tags } from "tsoa";
import { TodoDto } from "@pi-lot-interfaces/src/dtos/todo.dto";
import { TodoCategoryDto } from "@pi-lot-interfaces/src/dtos/todo-category.dto";
import { logger } from "../util/logger.constant";
import { TodoService } from "../services/todo.service";
import { TodoCategoryService } from "../services/todo-category.service";

@Route("todo")
@Tags("Todo")
export class TodoController extends Controller {

	// TODO: logging
	private _logger = logger.child({ label: "TodoController" });

	@Get("/getAll")
	public async getAll(): Promise<TodoDto[]> {
		return TodoService.findAll();
	}

	@Get("/getAllCategories")
	public async getAllCategories(): Promise<TodoCategoryDto[]> {
		return TodoCategoryService.findAll();
	}

	@Post("/create")
	public async create(@Body() todoDto: TodoDto): Promise<TodoDto> {
		return TodoService.create(todoDto);
	}

	@Put("/update/:id")
	public async update(@Path() id: number, @Body() todoDto: TodoDto): Promise<TodoDto | null> {
		return TodoService.update(id, todoDto);
	}

	@Delete("/delete/:id")
	public async delete(@Path() id: number): Promise<boolean> {
		return TodoService.delete(id);
	}

	@Post("/clear")
	public async clear(): Promise<boolean> {
		return TodoService.clear();
	}

	@Post("/createCategory")
	public async createCategory(@Body() todoCategoryDto: TodoCategoryDto): Promise<TodoCategoryDto> {
		return TodoCategoryService.create(todoCategoryDto);
	}

	@Delete("/deleteCategory/:id")
	public async deleteCategory(@Path() id: number): Promise<boolean> {
		return TodoCategoryService.delete(id);
	}
}
