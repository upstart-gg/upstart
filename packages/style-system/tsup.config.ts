import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src/**/*.ts"],
    format: ["esm"],
    dts: true,
    target: "es2022",
    metafile: !!(process.env.CI || process.env.ANALYZE_BUNDLE),
    clean: !options.watch,
    minify: !options.watch,
    sourcemap: !options.watch,
    bundle: true,
    // splitting: false,
    external: ["react", "react-dom"],
  };
});
