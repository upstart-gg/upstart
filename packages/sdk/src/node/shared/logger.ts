import {
  createLogger as createLoggerBase,
  type LogLevel,
  type LogOptions,
  type Logger as BaseLogger,
} from "vite";
import { version } from "../../../package.json";
import chalk from "chalk";

type UpstartLoggerLevel = LogLevel | "debug";

export function createLogger(level?: UpstartLoggerLevel, allowClearScreen?: boolean, showVersion = false) {
  // vite logger does not support "debug" level
  const logger = createLoggerBase(level === "debug" ? "info" : level, {
    prefix: "[upstart]",
    allowClearScreen,
  });

  if (showVersion) {
    logger.info(chalk.hex("#7270c6").bold(`🚀 Upstart v${version}\n`));
  }

  return {
    ...logger,
    success: (message: string, options?: LogOptions) => logger.info(chalk.green(message), options),
    error: (message: string, options?: LogOptions) => logger.error(chalk.red(message), options),
    warn: (message: string, options?: LogOptions) => logger.warn(chalk.yellow(message), options),
    warnOnce: (message: string, options?: LogOptions) => logger.warnOnce(chalk.yellow(message), options),
    debug: (message: string, options?: LogOptions) => {
      if (level === "debug") {
        logger.info(chalk.gray(message), options);
      }
    },
  };
}

export const logger = createLogger();

export type Logger = BaseLogger & {
  success: (message: string, options?: LogOptions) => void;
  debug: (message: string, options?: LogOptions) => void;
};
