/// <reference types="node" />
import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src/**/*.ts"],
    format: "esm",
    logLevel: "warn",
    dts: true,
    target: "es2022",
    metafile: !!(process.env.CI || process.env.ANALYZE_BUNDLE),
    clean: !options.watch,
    minify: !options.watch,
    sourcemap: true,
    external: ["react", "react-dom"],
    removeNodeProtocol: false,
  };
});
