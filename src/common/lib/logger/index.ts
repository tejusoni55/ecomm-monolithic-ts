// Logger library: Winston-based structured logging with OpenTelemetry support
import { createLogger, format, transports, Logger } from "winston";
const { OpenTelemetryTransportV3 } = require("@opentelemetry/winston-transport");

const { combine, timestamp, printf, errors, colorize, json } = format;

// Custom log format (console)
const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  return `${timestamp} [${level}]: ${stack || message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
});

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

export const logger: Logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels,
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // capture stack trace
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), consoleFormat),
    }),
    new OpenTelemetryTransportV3(),
  ],
});

export default logger;
