import { readFileSync } from "node:fs";
import { defineConfig } from "tsup";

const bannerText = readFileSync("../../banner.txt", "utf-8");
const banner = {
  js: bannerText,
  css: bannerText,
};

const loader = {
  ".html": "copy",
};

export default defineConfig((options) => {
  return [
    {
      entry: ["src/node", "!src/node/**/*.md", "!src/node/**/__tests__/**/*", "!src/node/**/__mocks__/**/*"],
      outDir: "dist/node",
      target: "node18",
      format: ["esm"],
      dts: true,
      minify: !options.watch,
      metafile: !options.watch,
      sourcemap: options.watch ? "inline" : false,
      splitting: false,
      external: [
        "zod",
        "tailwindcss",
        "jsdom",
        "vite",
        "@vitejs/plugin-react",
        "vite-tsconfig-paths",
        "@enpage/style-system",
        "axe-core",
      ],
      esbuildOptions(input) {
        input.banner = banner;
      },
      loader,
    },
    // The dev-client uses Vite's import.meta.env.DEV
    // We bundle it using tsup to avoid the automatic replacement at build time
    {
      entry: [
        "src/browser",
        "!src/browser/**/*.md",
        "!src/browser/**/__tests__/**/*",
        "!src/browser/**/__mocks__/**/*",
      ],
      outDir: "dist/browser",
      target: "es2020",
      format: ["esm"],
      dts: true,
      metafile: !options.watch,
      minify: !options.watch,
      sourcemap: options.watch ? "inline" : false,
      external: [
        "zod",
        "tailwindcss",
        "jsdom",
        "vite",
        "vite-tsconfig-paths",
        "@enpage/style-system",
        "postcss",
        "autoprefixer",
      ],
      esbuildOptions(input) {
        input.banner = banner;
      },
      loader,
    },
    {
      entry: [
        "src/shared",
        "!src/shared/**/*.md",
        "!src/shared/**/__tests__/**/*",
        "!src/shared/**/__mocks__/**/*",
      ],
      outDir: "dist/shared",
      target: "es2020",
      format: ["esm"],
      dts: true,
      metafile: !options.watch,
      minify: !options.watch,
      sourcemap: options.watch ? "inline" : false,
      external: ["zod", "tailwindcss", "jsdom", "vite", "vite-tsconfig-paths", "@enpage/style-system"],
      esbuildOptions(input) {
        input.banner = banner;
      },
      loader,
    },
  ];
});
