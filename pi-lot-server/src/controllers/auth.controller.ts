import { Body, Controller, Post, Route, Tags } from "tsoa";
import { logger } from "../util/logger.constant";
import { User } from "@pi-lot-interfaces/src/models/user.model";
import { UserDao } from "../database/dao/user.dao";
import { PiLotDatabase } from "../database/pi-lot-database.class";
import { LoginData } from "@pi-lot-interfaces/src/models/login-data.model";

@Route("auth")
@Tags("Authentication")
export class AuthController extends Controller {

	private _logger = logger.child({label: "AuthController"});
	private userDoa: UserDao;

	constructor() {
		super();
		this.userDoa = PiLotDatabase.getDao(UserDao);
	}

	@Post("/login")
	public async login(@Body() loginData: LoginData): Promise<User | undefined> {
		this._logger.info("login()");
		return await this.userDoa.login(loginData);
	}
}
