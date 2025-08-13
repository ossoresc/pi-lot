import { Body, Controller, Delete, Get, Path, Post, Route, Tags } from "tsoa";
import { UserDto } from "@pi-lot-interfaces/src/dtos/user.dto";
import { UserService } from "../services/user.service";
import { logger } from "../util/logger.constant";

@Route("user")
@Tags("User")
export class UserController extends Controller {

	// TODO: logging
	private _logger = logger.child({ label: "UserController" });

	@Get("/getAll")
	public async getAll(): Promise<UserDto[]> {
		return await UserService.findAll();
	}

	@Get("/getById/:id")
	public async getById(@Path() id: number): Promise<UserDto | null> {
		return await UserService.findOne(id);
	}

	@Post("/update/:id")
	public async update(@Path() id: number, @Body() user: UserDto): Promise<UserDto | null> {
		return await UserService.update(id, user);
	}

	@Delete("/delete/:id")
	public async delete(@Path() id: number) {
		return await UserService.delete(id);
	}
}
