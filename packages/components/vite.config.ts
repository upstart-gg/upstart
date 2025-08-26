import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import Inspect from "vite-plugin-inspect";
import devtoolsJson from "vite-plugin-devtools-json";

// import bundlesize from "vite-plugin-bundlesize";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  envPrefix: ["PUBLIC_"],
  base: "./",
  plugins: [
    tsconfigPaths() as PluginOption,
    devtoolsJson(),
    Inspect({
      open: true,
    }),
    react() as PluginOption,
    dts({
      include: [
        "src/editor/components/Editor.tsx",
        "src/editor/components/EditorWrapper.tsx",
        "src/editor/hooks/use-editor.ts",
        "src/shared/hooks/use-datasource.tsx",
        "src/shared/components/Page.tsx",
        "src/shared/utils/get-theme-css.ts",
      ],
      outDir: "dist/types",
    }),
  ],
  optimizeDeps: {
    // include: ["@upstart.gg/sdk"],
  },
  server: {
    port: +(process.env.PORT ?? 3008),
    server: {
      watch: {
        // Ignore node_modules and build outputs from other packages
        ignored: ["**/node_modules/**", "**/dist/**", "**/build/**"],
      },
    },
    ...(process.env.PROXY_API_REQUESTS
      ? {
          proxy: {
            "/editor": {
              target: "http://localhost:8080", // Backend server
              changeOrigin: true, // Ensure the request appears to come from the frontend server
            },
          },
        }
      : {}),
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
        "use-editor": "src/editor/hooks/use-editor.ts",
        "use-page-data": "src/editor/hooks/use-page-data.ts",
        "get-theme-css": "src/shared/utils/get-theme-css.ts",
      },
      cssFileName: "upstart-components",
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
