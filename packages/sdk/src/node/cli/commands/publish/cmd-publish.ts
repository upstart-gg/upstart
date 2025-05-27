import { resolve } from "node:path";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import chalk from "chalk";
import type { CommandArgOpts } from "../../types";
import { formatAPIError, getPackageManager } from "../../utils";
import { getTokenOrThrow } from "../../store";
import { uploadTemplate } from "./uploader";
import path from "node:path";
import { post } from "../../api";
import { API_ENDPOINT_REGISTER_TEMPLATE } from "../../constants";
import { loadConfigFromJsFile, validateTemplateConfig } from "~/node/shared/config";
import { isLoggedIn } from "../../is-logged-in";

export async function publish({ options, args, logger }: CommandArgOpts) {
  // check if user is logged in
  if (!(await isLoggedIn(true))) {
    const pkgCmd = getPackageManager();
    logger.error(
      `  ${chalk.redBright("Error")}: User token not found. Please run ${chalk.cyan(`${pkgCmd} run enpage:login`)} to authenticate or set the ${chalk.cyan("ENPAGE_API_TOKEN")} environment variable.\n`,
    );
    process.exit(1);
  }

  const templateDir = args.length
    ? path.isAbsolute(args[0])
      ? args[0]
      : resolve(process.cwd(), args[0])
    : process.cwd();

  if (!existsSync(templateDir)) {
    logger.error(`  Template directory not found: ${templateDir}. Aborting.\n`);
    process.exit(1);
  }

  const distDir =
    args.length > 1
      ? path.isAbsolute(args[1])
        ? args[1]
        : resolve(process.cwd(), args[1])
      : resolve(templateDir, "dist");

  if (!existsSync(distDir)) {
    logger.error(
      `  Dist directory not found: ${distDir}.\n  Please run 'build' before publishing. Aborting.\n`,
    );
    process.exit(1);
  }

  // check if enpage.config.js and package.json exist in the current directory
  // if not, exit with an error
  if (!existsSync(resolve(templateDir, "enpage.config.js"))) {
    logger.error(
      `  ${chalk.redBright("Error")}: file enpage.config.js not found in ${templateDir}. Aborting.\n`,
    );
    process.exit(1);
  }

  // load manifest from both enpage.config.js and package.json
  // manifest.json is used to store the template ID for future updates
  const config = await loadConfigFromJsFile(resolve(templateDir, "enpage.config.js"), logger);

  validateTemplateConfig(config, logger);

  const token = getTokenOrThrow();
  const pkgLocation = getPackageLocation(templateDir);

  if (!pkgLocation) {
    logger.error(`  ${chalk.redBright("Error")}: package.json file not found in ${templateDir}. Aborting.\n`);
    process.exit(1);
  }

  // load package.json to get the template ID (if it exists)
  const pkg = await getPackageJsonContents(pkgLocation);

  if (!pkg) {
    logger.error(
      `  ${chalk.redBright("Error")}: cannot read/parse package.json file in ${templateDir}. Aborting.\n`,
    );
    process.exit(1);
  }

  if (!pkg.enpage?.id) {
    // call API to create a new template
    const { data, isError, status } = await post<{ success: true; template: { id: string } }>(
      API_ENDPOINT_REGISTER_TEMPLATE,
      {}, // todo: fill with template data
    );
    if (isError) {
      logger.error(`  ${chalk.redBright("Error")}: Cannot register template: ${formatAPIError(data)}\n`);
      process.exit(1);
    }
    pkg.enpage ??= {};
    pkg.enpage.id = data.template.id;

    // save the template ID to package.json
    try {
      if (!options.dryRun) writeFileSync(pkgLocation, JSON.stringify(pkg, null, 2));
    } catch (e) {
      logger.error(
        `  ${chalk.redBright("Error")}: Cannot update template id in package.json file located in ${templateDir}. Aborting.\n`,
      );
      process.exit(1);
    }
  }

  const templateId = pkg.enpage.id;

  // submit template to Enpage
  logger.info(`Submitting template to Enpage...\n`);

  const uploadResults = await uploadTemplate(templateId, templateDir, token, options.dryRun);

  if (!uploadResults.success) {
    logger.error("\nUpload failed. See details above.\n");
    process.exit(1);
  }

  logger.success(`Template ${templateId} published.\n`);
}

function getPackageLocation(templateDir: string) {
  return existsSync(resolve(templateDir, "package.json"))
    ? resolve(templateDir, "package.json")
    : existsSync(resolve(templateDir, "template-package.json"))
      ? resolve(templateDir, "template-package.json")
      : false;
}

function getPackageJsonContents(pkgJsonPath: string) {
  try {
    return JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
  } catch (e) {
    return null;
  }
}
