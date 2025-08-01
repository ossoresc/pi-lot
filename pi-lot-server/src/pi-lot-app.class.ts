import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import { RegisterRoutes } from "./routes/routes";
import swaggerUi from "swagger-ui-express";
import * as swaggerJson from "./swagger/swagger.json";
import * as path from "node:path";
import { PiLotDatabase } from "./database/pi-lot-database.class";
import { logger } from "./util/logger.constant";

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

		// Database
		await PiLotDatabase.createDatabase();

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

		}
		this.app.use(cors(corsOptions));

		// TSOA Swagger
		RegisterRoutes(this.app);
		this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

		// Landing page
		this.app.use(express.static(path.join(__dirname, "views")));
		this.app.get("/", (req, res) => {
			res.sendFile(path.join(__dirname, "views/landing-page", "landing-page.html"));
		});
	}
}
