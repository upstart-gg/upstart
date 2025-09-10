import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { defineConfig } from "tsdown";

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
      entry: ["src/shared/**/*.ts", ...ignored],
      outDir: "dist/shared",
      target: "es2022",
      format: ["esm"],
      metafile: !!process.env.ANALYZE_BUNDLE,
      clean: !options.watch,
      minify: !options.watch,
      sourcemap: options.watch ? "inline" : false,
      external,
      esbuildOptions(input) {
        input.banner = banner;
      },
      // onSuccess: async () => {
      //   console.time("Types build time");
      //   execSync("pnpm build:types", {
      //     stdio: "inherit",
      //     // @ts-ignore
      //     cwd: import.meta.dirname,
      //   });
      //   console.timeEnd("Types build time");
      // },
      // loader: {
      //   ".html": "copy",
      // },
      removeNodeProtocol: false,
    },
  ];
});
