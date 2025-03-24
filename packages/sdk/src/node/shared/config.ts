import { manifestSchema } from "~/shared/manifest";
import fs from "node:fs";
import { readFile } from "node:fs/promises";
import fg from "fast-glob";
import { type Logger, logger as defaultLogger } from "./logger";
import { fromError } from "zod-validation-error";
import { basename, dirname, extname } from "node:path";
import type { TemplateConfig } from "~/shared/page";

export async function loadConfigFromJsFile(
  configPath: string,
  logger = defaultLogger,
): Promise<TemplateConfig> {
  if (!fs.existsSync(configPath)) {
    logger.error(
      "🔴 No enpage.config.js found!\nYour project must have an enpage.config.js file in the root directory.\n\n",
    );
    process.exit(1);
  }
  const config = (await import(configPath)) as TemplateConfig;

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

  if (config.manifest) {
    config.manifest.readme = readme;
  }

  return config;
}

export function loadConfigFromManifestFile(manifestPath: string, logger: Logger): TemplateConfig {
  if (!fs.existsSync(manifestPath)) {
    logger.error("🔴 No enpage.manifest.json found!\nYou may want to 'build' your template.\n\n");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
}

export function validateTemplateConfig(config: TemplateConfig, logger: Logger) {
  for (const key in config.datasources) {
    if (config.datasources[key].provider === "json" && !config.datasources[key].sampleData) {
      logger.error(
        `🔴 Error: Datasource "${key}" is missing sample data - nothing will be rendered during development! Please check your enpage.config.js file and add a "sampleData" key to your ${key} datasource.`,
      );
      throw new Error(`Missing sample data for datasource "${key}"`);
    }
  }

  const validated = manifestSchema.safeParse(config.manifest);
  if (!validated.success) {
    logger.error(`🔴 Error: template manifest is invalid. Check your call to defineManifest().\n`);
    const err = fromError(validated.error);
    logger.error(`Hint: ${err.toString()}\n\n`);
    process.exit(1);
  }

  return config;
}
