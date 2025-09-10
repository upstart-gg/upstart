import { readFileSync } from "node:fs";
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
      logLevel: "warn",
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
      removeNodeProtocol: false,
    },
  ];
});
