import { defineConfig, type PluginOption } from "vite";
// import react from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import devtoolsJson from "vite-plugin-devtools-json";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode, ...rest }) => {
  const watchMode = process.argv.includes("--watch");
  return {
    envPrefix: ["PUBLIC_"],
    base: "./",
    // logLevel: "warn",
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
          "src/editor/hooks/use-page-data.ts",
          "src/shared/components/Page.tsx",
          "src/shared/utils/get-theme-css.ts",
        ],
        outDir: "dist/types",
        afterDiagnostic: (diagnostics) => {
          if (diagnostics.length) {
            console.error(
              "Error while building types in @upstart/components. Please check error(s) above.\n",
            );
            process.exit(1);
          }
        },
      }),
    ],
    server: {
      port: +(process.env.PORT ?? 3008),
      // server: {
      //   watch: {
      //     // Ignore node_modules and build outputs from other packages
      //     // ignored: ["**/node_modules/**", "**/dist/**", "**/build/**"],
      //   },
      // },
      proxy: {
        "/editor": {
          target: "http://localhost:8080", // Backend server
          changeOrigin: true, // Ensure the request appears to come from the frontend server
          secure: false,
          configure: (proxy, _options) => {
            // console.log("listeners", proxy.listeners("error"));
            proxy.on("error", (err, _req, res) => {
              // don't crash the dev server on proxy errors
              // this could easily happen of the monorepo is not running
              if (!res.writableEnded) {
                // res.end();
              }
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
      sourcemap: !watchMode,
      reportCompressedSize: false,
      emptyOutDir: !watchMode,
      lib: {
        entry: {
          Editor: "src/editor/components/Editor.tsx",
          EditorWrapper: "src/editor/components/EditorWrapper.tsx",
          Page: "src/shared/components/Page.tsx",
          // Brick: "src/shared/components/Brick.tsx",
          "use-editor": "src/editor/hooks/use-editor.ts",
          "use-page-data": "src/editor/hooks/use-page-data.ts",
          "use-skip-initial-effect": "src/shared/hooks/use-skip-initial-effect.ts",
          "get-theme-css": "src/shared/utils/get-theme-css.ts",
        },
        cssFileName: "upstart-components",
        formats: ["es"],
      },
      minify: false,
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
          "chroma-js",
        ],
        output: {
          // preserveModules: true,
          exports: "named",
          chunkFileNames: "chunks/[name].[hash].js",
          assetFileNames: "assets/[name][extname]",
          entryFileNames: "[name].js",
          // manualChunks: (id) => {
          //   // AI and Chat related - split further
          //   if (id.includes("@ai-sdk") || id.includes("ai/")) {
          //     return "ai-sdk";
          //   }
          //   if (id.includes("motion/react")) {
          //     return "motion";
          //   }

          //   // Heavy page data hooks - separate these as they're very large
          //   if (id.includes("use-page-data") && !id.includes(".js")) {
          //     return "page-data-hooks";
          //   }
          //   if (id.includes("use-editable-text")) {
          //     return "editable-text-hooks";
          //   }
          //   if (id.includes("use-editor") && !id.includes(".js") && !id.includes("use-editor-hot-keys")) {
          //     return "editor-hooks";
          //   }

          //   // Editor heavy dependencies
          //   if (id.includes("@dnd-kit")) {
          //     return "dnd-kit";
          //   }

          //   // Split TipTap editor into smaller chunks
          //   // if (id.includes("@tiptap/starter-kit") || id.includes("@tiptap/core")) {
          //   //   return "tiptap-core";
          //   // }
          //   // if (id.includes("@tiptap/extension")) {
          //   //   return "tiptap-extensions";
          //   // }
          //   if (id.includes("@tiptap")) {
          //     return "tiptap";
          //   }

          //   // Split heavy UI components
          //   if (id.includes("react-joyride")) {
          //     return "joyride";
          //   }
          //   if (id.includes("react-player")) {
          //     return "react-player";
          //   }
          //   if (id.includes("react-select")) {
          //     return "react-select";
          //   }
          //   if (id.includes("leaflet")) {
          //     return "maps";
          //   }

          //   // Icons
          //   if (id.includes("@iconify")) {
          //     return "icons";
          //   }

          //   // Split markdown processing
          //   if (id.includes("react-markdown")) {
          //     return "react-markdown";
          //   }
          //   if (id.includes("rehype")) {
          //     return "rehype";
          //   }
          //   if (id.includes("remark")) {
          //     return "remark";
          //   }

          //   // Split chat components more granularly - target heavy imports
          //   if (id.includes("useChat") || id.includes("@ai-sdk/react")) {
          //     return "chat-ai-hooks";
          //   }
          //   if (id.includes("/Chat/ChatComponent") && !id.includes("Tool")) {
          //     return "chat-main";
          //   }
          //   if (id.includes("/Chat/ChatBox") || id.includes("/Chat/ChatReasoningPart")) {
          //     return "chat-ui";
          //   }
          //   if (id.includes("/Chat/ChatToolRenderer") || (id.includes("/Chat/") && id.includes("Tool"))) {
          //     return "chat-tools";
          //   }
          //   if (id.includes("/Chat/") && id.includes("Message")) {
          //     return "chat-messages";
          //   }
          //   if (id.includes("/Chat/")) {
          //     return "chat-misc";
          //   }

          //   // Split editor components more granularly
          //   if (id.includes("/editor/components/Tour")) {
          //     return "tour";
          //   }
          //   if (id.includes("/editor/components/Panel") || id.includes("/editor/components/NavBar")) {
          //     return "editor-panels";
          //   }
          //   if (
          //     id.includes("/editor/components/EditablePage") ||
          //     id.includes("/editor/components/EditableBrick")
          //   ) {
          //     return "editor-editable";
          //   }
          //   if (id.includes("/editor/components/Modal") || id.includes("/editor/components/DeviceFrame")) {
          //     return "editor-layout";
          //   }
          //   if (id.includes("/editor/components/") && id.includes(".tsx")) {
          //     return "editor-misc";
          //   }

          //   // Split shared components
          //   if (id.includes("/shared/components/bricks/")) {
          //     return "bricks";
          //   }
          //   if (id.includes("/shared/components/")) {
          //     return "shared-components";
          //   }

          //   // Video players - split individually as they're heavy
          //   if (id.includes("YouTube") || id.includes("Vimeo") || id.includes("Mux")) {
          //     return "video-players-main";
          //   }
          //   if (id.includes("Twitch") || id.includes("DailyMotion") || id.includes("Facebook")) {
          //     return "video-players-social";
          //   }
          //   if (
          //     id.includes("Player") &&
          //     (id.includes("Kaltura") || id.includes("Wistia") || id.includes("Vidyard"))
          //   ) {
          //     return "video-players-enterprise";
          //   }

          //   // Store and state management
          //   if (id.includes("zustand") || id.includes("zundo")) {
          //     return "state-management";
          //   }
          //   if (id.includes("immer")) {
          //     return "state-utils";
          //   }
          // },
        },
      },
    },
  };
});
