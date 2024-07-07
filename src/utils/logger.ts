import { createLogger, format, transports } from "winston";

export const logger =  createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: format.cli(),
    transports: [ new transports.Console()]
});