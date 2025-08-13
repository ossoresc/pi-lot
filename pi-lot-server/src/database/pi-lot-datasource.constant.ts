import { DataSource } from "typeorm";
import { entities } from "./entities/_entities.constant";
import { isDev } from "../util/environment.constant";
import path from "path";

export const dataSource = new DataSource({
	type: "sqlite",
	database: isDev ? path.join(__dirname, "pi-lot-dev.db") : path.join(__dirname, "pi-lot-prod.db"),
	synchronize: isDev,
	logging: isDev,
	entities: [...entities],
});
