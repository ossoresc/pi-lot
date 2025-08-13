import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import { RegisterRoutes } from "./routes/routes";
import swaggerUi from "swagger-ui-express";
import * as swaggerJson from "./swagger/swagger.json";
import * as path from "node:path";
import { logger } from "./util/logger.constant";
import { dataSource } from "./database/pi-lot-datasource.constant";
import { isDev } from "./util/environment.constant";
import { userRepository } from "./database/repositories/user.repository";

export class PiLotApp {

	private _logger = logger.child({label: "PiLotApp"});

	private app!: Express;
	private port!: number;

	public async start() {
		if (this.app == null) {
			this._logger.warn("Pi-Lot app is not initialized yet");
			await this.initialize();
		}

		this.app.listen(this.port, () => {
			this._logger.info(`Pi-Lot server running on http://localhost:${this.port}`);
			this._logger.info(`Swagger documentation on http://localhost:${this.port}/api-docs`);
		});
	}

	public async initialize(port: number = 3000) {
		if (this.app != null) {
			this._logger.warn("Pi-Lot app is already initialized");
			return;
		}

		// Main config
		this.app = express();
		this.port = port;
		this.app.use(express.json());

		// Cors
		const corsOptions: CorsOptions = {
			origin: [
				"http://localhost:4200",
				"http://raspberrypi.local"
			],
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
			// credentials: true // for cookies, auth
		}
		this.app.use(cors(corsOptions));

		// TypeORM DataSource
		await dataSource.initialize()
			.then(async () => {
				if (isDev) {
					await userRepository.create({name: "root", password: "root"});
				}
			})
			.catch((err) => {
				console.log(err);
			});

		// TSOA Swagger
		this.app.use("/api", (router => {
			RegisterRoutes(router);
			return router;
		})(express.Router()));
		this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
	}
}
