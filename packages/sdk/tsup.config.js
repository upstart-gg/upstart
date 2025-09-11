import { readFileSync } from "node:fs";
import { defineConfig } from "tsup";
import { execSync } from "node:child_process";

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
  "__STATIC_CONTENT_MANIFEST",
];

const ignored = ["!**/*.md", "!**/tests/**/*", "!**/*.test.ts", "!**/sample.ts"];

export default defineConfig((options) => {
  return [
    {
      entry: ["src/shared/**/*.ts", ...ignored],
      outDir: "dist/shared",
      target: "es2022",
      dts: false,
      format: "esm",
      removeNodeProtocol: false,
      metafile: !!process.env.ANALYZE_BUNDLE,
      clean: !options.watch,
      minify: !options.watch,
      sourcemap: options.watch ? "inline" : false,
      external,
      onSuccess: async () => {
        execSync("pnpm build:types", {
          stdio: "inherit",
          // @ts-ignore
          cwd: import.meta.dirname,
        });
      },
      esbuildOptions(input) {
        input.banner = banner;
      },
    },
  ];
});
