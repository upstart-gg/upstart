import fs from "node:fs";
import { readFile } from "node:fs/promises";
import fg from "fast-glob";
import { type Logger, logger as defaultLogger } from "./logger";
import { basename, dirname, extname } from "node:path";
import type { SiteAndPagesConfig } from "~/shared/site";

export async function loadConfigFromJsFile(
  configPath: string,
  logger = defaultLogger,
): Promise<SiteAndPagesConfig> {
  if (!fs.existsSync(configPath)) {
    logger.error(
      "🔴 No enpage.config.js found!\nYour project must have an enpage.config.js file in the root directory.\n\n",
    );
    process.exit(1);
  }
  const config = (await import(configPath)) as SiteAndPagesConfig;

  // Parse the readme files fro the same directory as the config file
  const readmePath = dirname(configPath);
  const readme: Record<string, string> = {};
  const readmeFiles = await fg(["README.enpage.md", "README.enpage.*.md"], {
    cwd: readmePath,
    onlyFiles: true,
    absolute: true,
    caseSensitiveMatch: false,
  });

  for (const file of readmeFiles) {
    const base = basename(file, ".md");
    const ext = extname(base);
    const language = (ext === ".enpage" ? "en" : ext.substring(1)).toLowerCase();
    logger.debug(`Found template readme file (${language}): ${basename(file)}`);
    readme[language] = await readFile(file, "utf-8");
  }

  return config;
}

export function loadConfigFromManifestFile(manifestPath: string, logger: Logger): SiteAndPagesConfig {
  if (!fs.existsSync(manifestPath)) {
    logger.error("🔴 No enpage.manifest.json found!\nYou may want to 'build' your template.\n\n");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
}

export function validateTemplateConfig(config: SiteAndPagesConfig, logger: Logger) {
  for (const key in config.site.datasources) {
    if (config.site.datasources[key].provider === "http-json" && !config.site.datasources[key].sampleData) {
      logger.error(
        `🔴 Error: Datasource "${key}" is missing sample data - nothing will be rendered during development! Please check your enpage.config.js file and add a "sampleData" key to your ${key} datasource.`,
      );
      throw new Error(`Missing sample data for datasource "${key}"`);
    }
  }

  // Todo: replace validation from zod to ajv
  // const validated = manifestSchema.safeParse(config.manifest);
  // if (!validated.success) {
  //   logger.error(`🔴 Error: template manifest is invalid. Check your call to defineManifest().\n`);
  //   const err = fromError(validated.error);
  //   logger.error(`Hint: ${err.toString()}\n\n`);
  //   process.exit(1);
  // }

  return config;
}
