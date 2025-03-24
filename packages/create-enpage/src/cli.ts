#!/usr/bin/env node
import tiged from "tiged";
import { program } from "commander";
import { resolve } from "node:path";
import path from "node:path";
import chalk from "chalk";
import { existsSync, lstatSync, readdirSync } from "node:fs";
import { cp, mkdir, writeFile, readFile } from "node:fs/promises";
import { input, select } from "@inquirer/prompts";
import { execSync } from "node:child_process";
import { GitIgnoreMatcher } from "./gitignore-matcher";

program
  .description("Create a new Enpage template")
  .argument("[directory]", "Directory to create the template in", ".")
  .option(
    // The template to clone or the path to the local template
    // Can take either:
    // - A template name (e.g. "example", without any "/"), in which case it will try to get it from
    // a dedicated git repository in the Enpage Org, like: enpage/template-${template}
    // - A git repository URL accepted by degit/tiged, like "myorg/mytemplate"
    // - A local path to a template directory, like "./mytemplate" (starting with a dot or a slash)
    //
    "-t, --template <template>",
    "Template to clone",
    // Default: Clone the latest tag of the template-example package
    // Being in a monorepo, the latest tag is named "#@upstart.gg/template-example@latest"
    // Only retrieve the template package directory, not the whole monorepo
    "upstart-gg/upstart/packages/template-example#@upstart.gg/template-example@latest",
  )
  .action(async (dir) => {
    const options = program.opts();
    const destination = resolve(process.cwd(), dir);
    const exist = existsSync(destination);

    if (!exist) {
      // create the directory
      process.stdout.write(`Creating directory ${destination}... `);
      await mkdir(destination, { recursive: true });
      console.log(chalk.cyan("OK"));
    } else if (!lstatSync(destination).isDirectory()) {
      console.log(chalk.red(`${destination} exists but is not a directory. Aborting.`));
      process.exit(1);
    } else if (!isDirectoryEmpty(destination)) {
      console.log(chalk.red(`Directory ${destination} is not empty. Aborting.`));
      process.exit(1);
    }

    process.stdout.write("Cloning template example... ");

    const gitUrlOrPath = formatTemplateString(options.template);

    if (!isLocalTemplate(gitUrlOrPath)) {
      // clone remote template (git)
      await tiged(gitUrlOrPath, {
        verbose: true,
        mode: "git",
        disableCache: true,
      })
        .clone(destination)
        .catch((err) => {
          console.error(chalk.red(`Error cloning template: ${err.message}`));
          process.exit(1);
        });
    } else {
      // copy the local template (directory)
      const localPath = resolve(gitUrlOrPath);
      const gitignore = path.join(localPath, ".gitignore");
      const matcher = new GitIgnoreMatcher(gitignore, [
        "node_modules/**",
        ".cache/**",
        "**/.DS_Store",
        ".git/**",
        // upload sources, not dist
        "dist/**",
      ]);

      await cp(resolve(gitUrlOrPath), destination, {
        recursive: true,
        filter: (source) => matcher.match(source) === false,
      }).catch((err) => {
        console.error(chalk.red(`Error copying template: ${err.message}`));
        process.exit(1);
      });
    }

    console.log(chalk.cyan("OK\n"));
    console.log("Let's set up your new template:");

    const name = await input({
      message: "Name your template",
      validate(value) {
        if (value.length > 0) {
          return true;
        }
        return "Name cannot be empty";
      },
    });

    const description = await input({
      message: "Enter a template description",
      validate(value) {
        if (value.length > 0) {
          return true;
        }
        return "Description cannot be empty";
      },
    });

    const author = await input({
      message: "Enter the author's name",
      validate(value) {
        if (value.length > 0) {
          return true;
        }
        return "Author name cannot be empty";
      },
    });

    const visibility = await select({
      message: "Choose the visibility of the template",
      choices: [
        { name: "Private", value: "private", description: "For your eyes only" },
        {
          name: "Public",
          value: "public",
          description: "To be available on Enpage (paid or free users)",
        },
      ],
    });

    // ask for tags
    const tags = await input({ message: "Enter tags for the template (optional, comma separated)" });

    const homepage = await input({
      message: "Enter a homepage URL (optional)",
      validate(value) {
        if (value.length === 0) {
          return true;
        }
        try {
          new URL(value);
          return true;
        } catch (e) {}
        return "Homepage URL must start with https://";
      },
    });

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const pkgPath = resolve(destination, "package.json");
    const pkgJson = JSON.parse(await readFile(pkgPath, "utf-8"));

    if (isEnpageTemplate(gitUrlOrPath) || isLocalTemplate(gitUrlOrPath)) {
      // replace all references to "workspace:" in all kind of dependencies with the "latest" tag
      for (const depType of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
        if (pkgJson[depType]) {
          for (const [dep, version] of Object.entries<string>(pkgJson[depType])) {
            if (version.startsWith("workspace:")) {
              // todo: allow overriding the version to allow testing snapshot releases made by the Enpage Org
              pkgJson[depType][dep] = "latest";
            }
          }
        }
      }
      // biome-ignore lint/performance/noDelete: need to remove the lint script
      delete pkgJson.scripts.lint;
      // biome-ignore lint/performance/noDelete: need to remove the ci:lint script
      delete pkgJson.scripts["ci:lint"];
    }

    // biome-ignore lint/performance/noDelete: need to remove the ci:lint script
    delete pkgJson.publishConfig;

    Object.assign(pkgJson, {
      // name needs to be valid for registries, so we generate a new one
      name: `enpage-template-${path.basename(destination)}`,
      author,
      description,
      keywords: [...new Set([...pkgJson.keywords, ...tagsArray])],
      license: "UNLICENSED",
      homepage: homepage.length > 0 ? homepage : undefined,
      private: visibility === "private",
      enpage: {
        name,
        description,
        private: visibility === "private",
      },
    });

    // write the package.json
    process.stdout.write("\nWriting package.json... ");
    await writeFile(pkgPath, JSON.stringify(pkgJson, null, 2));
    console.log(chalk.cyan("OK"));

    // install dependencies
    console.log("Installing dependencies... ");

    const pm = getPackageManager();
    const runCmd = getPackageManagRunCmd(pm);

    if (pm === "pnpm") {
      execSync(`${pm} install --ignore-workspace`, { cwd: destination, stdio: "inherit" });
    } else {
      execSync(`${pm} install`, { cwd: destination, stdio: "inherit" });
    }

    console.log("");
    console.log(`${chalk.cyan("All done!")}\n`);
    console.log("You can now develop your template:");
    console.log("");

    if (dir !== ".") console.log(chalk.cyan(`  cd ${dir}`));
    console.log(chalk.cyan(`  ${runCmd} dev\n`));

    process.exit(0);
  });

program.parse();

function isDirectoryEmpty(path: string) {
  const files = readdirSync(path);
  return files.length === 0;
}

// Detect package manager
function getPackageManager() {
  let packageManager: string | undefined;
  if (process.env.npm_config_user_agent) {
    const pmPart = process.env.npm_config_user_agent.split(" ")[0];
    packageManager = pmPart.slice(0, pmPart.lastIndexOf("/"));
  }
  if (!packageManager) {
    packageManager = "npm";
  }
  return packageManager;
}

function getPackageManagRunCmd(pm?: string) {
  const packageManager = pm ?? getPackageManager();
  return packageManager === "npm" ? `${packageManager} run` : packageManager;
}

function formatTemplateString(template: string) {
  if (isLocalTemplate(template)) {
    return template;
  }
  // shortcut for templates dedicated repositories in the enpage org
  if (template.includes("/") === false) {
    template = `enpage/template-${template}`;
  }
  return template;
}

function isLocalTemplate(template: string) {
  return template.startsWith(".") || template.startsWith("/");
}

function isEnpageTemplate(template: string) {
  return template.startsWith("enpage/");
}
