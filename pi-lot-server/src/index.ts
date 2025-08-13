import { PiLotApp } from "./pi-lot-app.class";
import { logger } from "./util/logger.constant";

async function startServer() {
	const app = new PiLotApp();
	await app.initialize();
	await app.start();
}

startServer().catch(error => {
	logger.error(`Error while starting server: ${error}`);
});
