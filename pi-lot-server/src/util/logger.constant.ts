import { Logger, createLogger, format, transports } from "winston";

const {combine, timestamp, colorize, align, printf, label } = format;

const logFormat = printf((info) => `[${info.timestamp}] (${info.label}) ${info.level}: ${info.message}`);

function initializeLogger(): Logger {
	const logger = createLogger({
		level: 'info',
		format: combine(
			timestamp({
				format: 'YYYY-MM-DD hh:mm:ss.SSS A',
			}),
			align(),
			logFormat
		),
		defaultMeta: {service: 'pi-lot-server'},
		transports: [],
	})

	if (process.env.NODE_ENV !== 'production') {
		logger.add(new transports.Console({
			format: combine(
				colorize({all: true}),
				timestamp({
					format: 'YYYY-MM-DD hh:mm:ss.SSS A',
				}),
				align(),
				logFormat
			),
		}));
		// TODO: check deployed directory and fix
		logger.add(new transports.File({filename: 'dist/pi-lot-server/src/logs/error.log', level: 'error'}));
		logger.add(new transports.File({filename: 'dist/pi-lot-server/src/logs/combined.log'}));
	}

	// TODO: env file and dev env logger destination

	return logger;
}

export const logger: Logger = initializeLogger();
