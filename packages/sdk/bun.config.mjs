await Bun.build({
  entrypoints: ["src/shared/index.ts"],
  outdir: "./dist-bun",
  splitting: true,
  target: "browser",
  packages: "external",
  minify: true,
});
