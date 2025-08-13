import { Body, Controller, Post, Route, Tags } from "tsoa";
import { logger } from "../util/logger.constant";
import { UserDto } from "@pi-lot-interfaces/src/dtos/user.dto";
import { LoginData } from "@pi-lot-interfaces/src/models/login-data.model";

@Route("auth")
@Tags("Authentication")
export class AuthController extends Controller {

	private _logger = logger.child({label: "AuthController"});

	@Post("/login")
	public async login(@Body() loginData: LoginData): Promise<UserDto | undefined> {
		// TODO: login
		return undefined;
	}
}
