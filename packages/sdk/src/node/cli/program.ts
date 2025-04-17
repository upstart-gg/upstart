#!/usr/bin/env node
import { program, type Command, type OptionValues } from "commander";
import type { BuildOptions, CommonOptions } from "./types";
import { publish } from "./commands/publish/cmd-publish";
import { login } from "./commands/login/cmd-login";
import { buildTemplate } from "./commands/cmd-build";
import { createLogger, type Logger } from "../shared/logger";
import { logout } from "./commands/logout/cmd-logout";

let logger: Logger;

program
  .name("enpage")
  .option("-l, --logLevel <level>", `[string] info | warn | error | silent | debug`)
  .option("--clearScreen", `[boolean] allow/disable clear screen when logging`)
  .option("--dry-run", `[boolean] run command without making changes`)
  .hook("preAction", (thisCommand) => {
    logger = createLogger(
      thisCommand.optsWithGlobals().logLevel,
      thisCommand.optsWithGlobals().clearScreen,
      true,
    );
    // for now, disable the form-data warning until they fix it
    process.removeAllListeners("warning");
    process.on("warning", (warning) => {
      if (warning.name === "DeprecationWarning" && warning.message.includes("util.isArray")) {
        return;
      }
      logger.warnOnce(`Warning: ${warning.name} - ${warning.message}`);
    });
  });

program
  .command("build")
  .description("Build template")
  .option(
    "--ssr [type]",
    `Enable server side rendering.
Pass --ssr to generate a SSR-enabled build.
Pass --ssr=local to generate a SSR-enabled build that can be tested locally.`,
    Boolean,
    false,
  )
  .option("--no-clean", `Don't clean directory before buidling`)
  .action(function (this: Command) {
    buildTemplate(getArgsOptionsObject<BuildOptions>(this));
  });

program
  .command("publish")
  .description("Publish a template to Enpage")
  .argument("[directory]", "Directory to publish")
  .option("--no-check", `Don't check for required files`)

  .action(function (this: Command) {
    publish(getArgsOptionsObject(this));
  });

program
  .command("login")
  .description("Login to Enpage")
  .action(function (this: Command) {
    login(getArgsOptionsObject(this));
  });

program
  .command("logout")
  .description("Logout from Enpage")
  .action(function (this: Command) {
    logout(getArgsOptionsObject(this));
  });

program.parse();

function getArgsOptionsObject<O extends OptionValues>(cmd: Command) {
  return { options: cmd.optsWithGlobals<CommonOptions & O>(), args: cmd.args, logger };
}
