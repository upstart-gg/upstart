import { build } from "vite";
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sync as rmSync } from "rimraf";
import type { CommandArgOpts, BuildOptions, CommonOptions } from "../types";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const configFile = resolve(__dirname, "../builder/vite-config.js");
const serverEntryFile = resolve(__dirname, "../builder/vite-entry-server.js");

export async function buildTemplate({ options, logger }: CommandArgOpts<CommonOptions & BuildOptions>) {
  logger.info("Building template...\n");

  if (options.clean) {
    rmSync(path.join(process.cwd(), "dist"));
  }

  let mode = "production";

  if (options.ssr === "local") {
    mode = "development";
    process.env.NODE_ENV = mode;
  }

  if (options.ssr) {
    // 1. client build
    await build({
      configFile,
      customLogger: logger,
      mode,
      logLevel: options.logLevel,
      clearScreen: options.clearScreen,
      build: {
        ssrManifest: true,
        emptyOutDir: true,
      },
    });

    // 2. server build
    await build({
      configFile,
      customLogger: logger,
      mode,
      logLevel: options.logLevel,
      clearScreen: options.clearScreen,
      ssr: {
        target: "webworker",
      },
      build: {
        ssr: serverEntryFile,
      },
    });
  } else {
    await build({
      configFile,
      customLogger: logger,
      logLevel: options.logLevel,
      clearScreen: options.clearScreen,
      build: {
        emptyOutDir: true,
      },
    });
  }
}
