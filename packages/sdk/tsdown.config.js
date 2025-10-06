import { defineConfig } from "tsdown";
import { execSync } from "node:child_process";

const external = [
  "vite",
  "@vitejs/plugin-react",
  "@sinclair/typebox",
  "lodash-es",
  "react",
  "react-dom",
  "react-icons",
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
      target: "esnext",
      nodeProtocol: true,
      // unbundle: true,
      metafile: !!process.env.ANALYZE_BUNDLE,
      clean: !options.watch,
      sourcemap: options.watch ? "inline" : true,
      external,
      dts: {
        sourcemap: true,
      },
      // onSuccess: async () => {
      //   execSync("pnpm build:types", {
      //     stdio: ["ignore", "inherit"],
      //     // @ts-ignore
      //     cwd: import.meta.dirname,
      //   });
      // },
    },
  ];
});
