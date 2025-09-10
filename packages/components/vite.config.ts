import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import devtoolsJson from "vite-plugin-devtools-json";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  envPrefix: ["PUBLIC_"],
  base: "./",
  logLevel: "warn",
  plugins: [
    tsconfigPaths() as PluginOption,
    devtoolsJson(),
    react({}) as PluginOption,
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
      afterDiagnostic: (diagnostics) => {
        if (diagnostics.length) {
          console.error("Error while building types in @upstart/components. Please check error(s) above.\n");
          process.exit(1);
        }
      },
    }),
  ],
  server: {
    port: +(process.env.PORT ?? 3008),
    server: {
      watch: {
        // Ignore node_modules and build outputs from other packages
        ignored: ["**/node_modules/**", "**/dist/**", "**/build/**"],
      },
    },
    proxy: {
      "/editor": {
        target: "http://localhost:8080", // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
              console.log("Received Error Response from the Target:", proxyRes.statusCode, req.url);
            }
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      lodash: "lodash-es",
    },
  },
  build: {
    copyPublicDir: false,
    sourcemap: true,
    reportCompressedSize: false,
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
    rollupOptions: {
      preserveEntrySignatures: "strict",
      external: [
        "react-icons",
        "react",
        "react-dom",
        "@sinclair/typebox",
        "@upstart.gg/style-system",
        "@upstart.gg/sdk",
        "lodash-es",
        "lodash",
      ],
      output: {
        preserveModules: true,
        exports: "named",
        chunkFileNames: "chunks/[name].[hash].js",
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
  },
}));
