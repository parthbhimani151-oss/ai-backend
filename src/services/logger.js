import winston from 'winston';
import config from '../config/index.js';

const { combine, timestamp, json, colorize, printf } = winston.format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});

const logger = winston.createLogger({
    level: config.nodeEnv === 'production' ? 'info' : 'debug',
    defaultMeta: { service: 'ai-backend' },
    transports: [
        new winston.transports.Console({
            format: combine(
                timestamp(),
                colorize(),
                consoleFormat
            ),
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: combine(timestamp(), json()),
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: combine(timestamp(), json()),
        }),
    ],
    exitOnError: false,
});

// Create logs directory if it doesn't exist
import { existsSync, mkdirSync } from 'fs';
if (!existsSync('logs')) {
    mkdirSync('logs');
}

export default logger;
