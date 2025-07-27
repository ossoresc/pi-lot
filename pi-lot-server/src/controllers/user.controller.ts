import { Controller, Get, Route, Tags } from "tsoa";
import { User } from "@pi-lot-interfaces/src/models/user.model.js";

@Route("user")
@Tags("User")
export class UserController extends Controller {

	@Get("/getAll")
	public async getAll(): Promise<User[]> {
		return [] as User[];
	}

}
