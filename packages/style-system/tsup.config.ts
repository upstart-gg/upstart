/// <reference types="node" />
import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src/**/*.ts"],
    format: "esm",
    logLevel: "warn",
    dts: true,
    target: "esnext",
    metafile: !!(process.env.CI || process.env.ANALYZE_BUNDLE),
    clean: !options.watch,
    minify: false,
    sourcemap: true,
    external: ["react", "react-dom"],
    removeNodeProtocol: false,
  };
});
