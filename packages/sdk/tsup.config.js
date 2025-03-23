import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { defineConfig } from "tsup";

const bannerText = readFileSync("../../banner.txt", "utf-8");
const banner = {
  js: bannerText,
  css: bannerText,
};

const loader = {
  ".html": "copy",
};

const external = [
  // "zod",
  // "tailwindcss",
  // "jsdom",
  "vite",
  "vite-plugin-inspect",
  "@vitejs/plugin-react",
  // "vite-tsconfig-paths",
  // "postcss",
  // "postcss-preset-env",
  // "cssnano",
  // "autoprefixer",
  // "@fullhuman/postcss-purgecss",

  // "@twind/core",
  // "@twind/with-react",
  // "@twind/preset-autoprefix",
  // "@twind/preset-ext",
  // "@twind/preset-line-clamp",
  // "@twind/preset-tailwind",
  // "@twind/preset-tailwind-forms",
  // "@twind/preset-typography",

  // "axe-core",
  "react",
  "react-dom",

  "react-resizable",

  "fsevents",
  "lightningcss",
  "virtual:enpage-page-config.json",
  "__STATIC_CONTENT_MANIFEST",
];

const ignored = ["!**/*.md", "!**/tests/**/*", "!**/sample.ts"];

export default defineConfig((options) => {
  return [
    {
      entry: ["src/node", ...ignored],
      outDir: "dist/node",
      target: "node22.11",
      format: ["esm"],
      dts: false,
      // clean: !options.watch,
      clean: false,
      minify: !options.watch,
      metafile: !!process.env.ANALYSE_BUNDLE,
      sourcemap: options.watch ? "inline" : false,
      // Important: force splitting to false to avoid issues with dynamic imports and __dirname resolutions
      splitting: false,
      external,
      // Force bundling of lodash-es for the CLI
      // noExternal: ["lodash-es"],
      esbuildOptions(input) {
        input.banner = banner;
      },
      loader,
      removeNodeProtocol: false,
    },
    {
      entry: [
        "src/shared/page.ts",
        "src/shared/errors.ts",
        "src/shared/attributes.ts",
        "src/shared/bricks",
        "src/shared/bricks.ts",
        "src/shared/brick-manifest.ts",
        "src/shared/datasources.ts",
        "src/shared/datasources/types.ts",
        "src/shared/datasources/schemas.ts",
        "src/shared/datarecords.ts",
        "src/shared/datarecords/types.ts",
        "src/shared/layout-constants.ts",
        "src/shared/utils/invariant.ts",
        "src/shared/utils/merge.ts",
        "src/shared/oauth.ts",
        "src/shared/ajv.ts",
        "src/shared/themes",
        "src/shared/theme.ts",
        "src/shared/responsive.ts",
        "src/shared/analytics",
        "src/shared/datasources/external/meta/oauth/config.ts",
        "src/shared/datasources/external/tiktok/oauth/config.ts",
        "src/shared/datasources/external/youtube/oauth/config.ts",
        "src/shared/datarecords/external/google/oauth/config.ts",
        "src/shared/env.ts",
        ...ignored,
      ],
      outDir: "dist/shared",
      target: "es2020",
      format: ["esm"],
      dts: false,
      // splitting: false,
      // dts: true,
      // metafile: process.env.CI || process.env.ANALYSE_BUNDLE,
      metafile: !!process.env.ANALYSE_BUNDLE,
      // clean: !options.watch,
      clean: false,
      minify: !options.watch,
      sourcemap: options.watch ? "inline" : false,
      external,
      esbuildOptions(input) {
        input.banner = banner;
      },
      onSuccess: async () => {
        console.time("Types build time");
        execSync("pnpm build:types", {
          stdio: "inherit",
          // @ts-ignore
          cwd: import.meta.dirname,
        });
        console.timeEnd("Types build time");
      },
      loader,
      removeNodeProtocol: false,
    },
  ];
});
