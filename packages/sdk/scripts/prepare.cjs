const fs = require("node:fs");
const { resolve } = require("node:path");

const cliFile = resolve(__dirname, "../dist/node/cli/program.js");

const getPackageManager = () => (process.env.npm_config_user_agent ?? "").split("/")[0] || "npm";

if (!fs.existsSync(cliFile) && !process.env.CI) {
  console.log("Building SDK CLI...");
  const manager = getPackageManager();
  // run build script in the package directory packages/sdk
  require("node:child_process").execSync(`${manager} run build`, {
    cwd: resolve(__dirname, ".."),
    stdio: ["ignore", "inherit"],
  });
}
