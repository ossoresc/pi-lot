import { Controller, Get, Route, Tags } from "tsoa";
import { Ping } from "@pi-lot-interfaces/src/models/ping.model.js";

@Route("util")
@Tags("Utility")
export class UtilityController extends Controller {

	@Get("/ping")
	public async ping(): Promise<Ping> {
		return {
			message: "Pong",
			timestamp: new Date().toISOString()
		} as Ping;
	}
}
