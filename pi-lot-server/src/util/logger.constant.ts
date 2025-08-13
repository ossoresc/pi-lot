import { Logger, createLogger, format, transports } from "winston";
import path from "path";

const {combine, timestamp, colorize, printf, label, align } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
	const fixedLabel = String(label).padEnd(20);
	return `[${timestamp}] [${fixedLabel}] ${level}: ${message}`;
});

const LOG_DIR = path.join(__dirname, "logs")

function initializeLogger(): Logger {
	const logger = createLogger({
		level: 'info',
		format: combine(
			timestamp({
				format: 'YYYY-MM-DD hh:mm:ss.SSS A',
			}),
			colorize({ level: true }),
			logFormat,
		),
		defaultMeta: {service: 'pi-lot-server'},
		transports: [],
	})

	if (process.env.NODE_ENV !== 'production') {
		logger.add(new transports.Console({
			format: combine(
				timestamp({
					format: 'YYYY-MM-DD hh:mm:ss.SSS A',
				}),
				colorize({ level: true }),
				logFormat,
			),
		}));

		logger.add(new transports.File({filename: path.join(LOG_DIR, 'error.log'), level: 'error'}));
		logger.add(new transports.File({filename: path.join(LOG_DIR, 'combined.log')}));
	}

	return logger;
}

export const logger: Logger = initializeLogger();
