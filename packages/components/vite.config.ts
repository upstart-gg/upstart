import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import Inspect from "vite-plugin-inspect";
// import bundlesize from "vite-plugin-bundlesize";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  envPrefix: ["PUBLIC_"],
  base: "./",
  plugins: [
    tsconfigPaths() as PluginOption,
    Inspect({
      open: true,
    }),
    react() as PluginOption,
    dts({
      include: [
        "src/editor/components/Editor.tsx",
        "src/editor/components/EditorWrapper.tsx",
        // "src/editor/hooks/use-editor.ts",
        "src/shared/hooks/use-datasource.tsx",
        "src/shared/components/Page.tsx",
        "src/shared/utils/get-theme-css.ts",
      ],
      outDir: "dist/types",
    }),
    // process.env.NODE_ENV === "production" &&
    //   bundlesize({
    //     limits: [{ name: "**/*", limit: "1.6 mB" }],
    //   }),
  ],
  optimizeDeps: {
    // include: ["@upstart.gg/sdk"],
  },
  server: {
    port: +(process.env.PORT ?? 3008),
  },
  resolve: {
    alias: {
      lodash: "lodash-es",
    },
  },
  build: {
    copyPublicDir: false,
    sourcemap: true,
    lib: {
      entry: {
        Editor: "src/editor/components/Editor.tsx",
        EditorWrapper: "src/editor/components/EditorWrapper.tsx",
        Page: "src/shared/components/Page.tsx",
        // Brick: "src/shared/components/Brick.tsx",
        // "use-editor": "src/editor/hooks/use-editor.ts",
        // "use-datasource": "src/shared/hooks/use-datasource.tsx",
        "get-theme-css": "src/shared/utils/get-theme-css.ts",
      },
      formats: ["es"],
    },
    minify: process.env.NODE_ENV === "production" && process.env.NOMINIFY !== "1",
    // cssMinify: false,
    rollupOptions: {
      external: [
        "react-icons",
        "react",
        "react-dom",
        // "ajv",
        "react/jsx-runtime",
        "@sinclair/typebox",
        "@upstart.gg/style-system",
        "@upstart.gg/sdk",
        "lodash-es",
        "lodash",
      ],
      output: {
        chunkFileNames: "chunks/[name].[hash].js",
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
  },
}));
