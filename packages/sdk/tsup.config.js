import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { defineConfig } from "tsup";

const bannerText = readFileSync("../../banner.txt", "utf-8");
const banner = {
  js: bannerText,
  css: bannerText,
};

const external = [
  "vite",
  "@vitejs/plugin-react",
  "react",
  "react-dom",
  "react-icons",
  "react/jsx-runtime",
  "react-resizable",
  "fsevents",
  "lightningcss",
  "virtual:enpage-page-config.json",
  "__STATIC_CONTENT_MANIFEST",
];

const ignored = ["!**/*.md", "!**/tests/**/*", "!**/*.test.ts", "!**/sample.ts"];

export default defineConfig((options) => {
  return [
    {
      entry: [
        "src/shared",
        // "src/shared/ajv.ts",
        // "src/shared/analytics",
        // "src/shared/attributes.ts",
        // "src/shared/bricks",
        // "src/shared/bricks.ts",
        // "src/shared/brick-manifest.ts",
        // "src/shared/context.ts",
        // "src/shared/ai",
        // "src/shared/datasources.ts",
        // "src/shared/datasources/types.ts",
        // "src/shared/datasources/schemas.ts",
        // "src/shared/datasources/external/meta/oauth/config.ts",
        // "src/shared/datasources/external/tiktok/oauth/config.ts",
        // "src/shared/datasources/external/youtube/oauth/config.ts",
        // "src/shared/datarecords/external/google/oauth/config.ts",
        // "src/shared/datarecords/external/google/sheets/handler.ts",
        // "src/shared/datarecords/external/notion/handler.ts",
        // "src/shared/datarecords/external/airtable/handler.ts",
        // "src/shared/datarecords.ts",
        // "src/shared/datarecords/types.ts",
        // "src/shared/env.ts",
        // "src/shared/errors.ts",
        // "src/shared/images.ts",
        // "src/shared/layout-constants.ts",
        // "src/shared/oauth.ts",
        // "src/shared/page.ts",
        // "src/shared/prompt.ts",
        // "src/shared/responsive.ts",
        // "src/shared/site.ts",
        // "src/shared/sitemap.ts",
        // "src/shared/template.ts",
        // "src/shared/theme.ts",
        // "src/shared/themes",
        // "src/shared/utils",
        ...ignored,
      ],
      outDir: "dist/shared",
      target: "es2022",
      format: ["esm"],
      dts: false,
      metafile: !!process.env.ANALYZE_BUNDLE,
      clean: !options.watch,
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
      loader: {
        ".html": "copy",
      },
      removeNodeProtocol: false,
    },
  ];
});
