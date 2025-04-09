import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src/**/*.ts"],
    format: ["esm"],
    dts: true,
    target: "es2020",
    metafile: !!(process.env.CI || process.env.ANALYSE_BUNDLE),
    clean: !options.watch,
    minify: !options.watch,
    sourcemap: options.watch ? "inline" : false,
    splitting: false,
    external: ["react", "react-dom"],
  };
});
