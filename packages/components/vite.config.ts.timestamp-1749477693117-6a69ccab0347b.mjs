// vite.config.ts
import { defineConfig } from "file:///Users/matt/dev/upstart/node_modules/.pnpm/vite@5.4.10_@types+node@20.17.30_lightningcss@1.30.1/node_modules/vite/dist/node/index.js";
import react from "file:///Users/matt/dev/upstart/node_modules/.pnpm/@vitejs+plugin-react@4.3.4_vite@5.4.10_@types+node@20.17.30_lightningcss@1.30.1_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///Users/matt/dev/upstart/node_modules/.pnpm/vite-plugin-dts@4.3.0_@types+node@20.17.30_rollup@4.39.0_typescript@5.5.3_vite@5.4.10_@_261b020351d0ae300a2e5cefdf774e80/node_modules/vite-plugin-dts/dist/index.mjs";
import Inspect from "file:///Users/matt/dev/upstart/node_modules/.pnpm/vite-plugin-inspect@0.8.7_rollup@4.39.0_vite@5.4.10_@types+node@20.17.30_lightningcss@1.30.1_/node_modules/vite-plugin-inspect/dist/index.mjs";
import tsconfigPaths from "file:///Users/matt/dev/upstart/node_modules/.pnpm/vite-tsconfig-paths@5.1.4_typescript@5.5.3_vite@5.4.10_@types+node@22.14.0_lightningcss@1.30.1_/node_modules/vite-tsconfig-paths/dist/index.js";
var vite_config_default = defineConfig(({ mode }) => ({
  envPrefix: ["PUBLIC_"],
  base: "./",
  plugins: [
    tsconfigPaths(),
    Inspect({
      open: true
    }),
    react(),
    dts({
      include: [
        "src/editor/components/Editor.tsx",
        "src/editor/components/EditorWrapper.tsx",
        "src/editor/hooks/use-editor.ts",
        "src/shared/hooks/use-datasource.tsx",
        "src/shared/components/Page.tsx",
        "src/shared/utils/get-theme-css.ts"
      ],
      outDir: "dist/types"
    })
    // process.env.NODE_ENV === "production" &&
    //   bundlesize({
    //     limits: [{ name: "**/*", limit: "1.6 mB" }],
    //   }),
  ],
  optimizeDeps: {
    // include: ["@upstart.gg/sdk"],
  },
  server: {
    port: +(process.env.PORT ?? 3008)
  },
  resolve: {
    alias: {
      lodash: "lodash-es"
    }
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
        "use-datasource": "src/shared/hooks/use-datasource.tsx",
        "get-theme-css": "src/shared/utils/get-theme-css.ts"
      },
      formats: ["es"]
    },
    minify: process.env.NODE_ENV === "production" && process.env.NOMINIFY !== "1",
    // cssMinify: false,
    rollupOptions: {
      external: [
        "react-icons",
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@sinclair/typebox",
        "@upstart.gg/style-system",
        "@upstart.gg/sdk",
        "lodash-es",
        "lodash"
      ],
      output: {
        chunkFileNames: "chunks/[name].[hash].js",
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js"
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWF0dC9kZXYvdXBzdGFydC9wYWNrYWdlcy9jb21wb25lbnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWF0dC9kZXYvdXBzdGFydC9wYWNrYWdlcy9jb21wb25lbnRzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tYXR0L2Rldi91cHN0YXJ0L3BhY2thZ2VzL2NvbXBvbmVudHMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgUGx1Z2luT3B0aW9uIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xuaW1wb3J0IEluc3BlY3QgZnJvbSBcInZpdGUtcGx1Z2luLWluc3BlY3RcIjtcbi8vIGltcG9ydCBidW5kbGVzaXplIGZyb20gXCJ2aXRlLXBsdWdpbi1idW5kbGVzaXplXCI7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBlbnZQcmVmaXg6IFtcIlBVQkxJQ19cIl0sXG4gIGJhc2U6IFwiLi9cIixcbiAgcGx1Z2luczogW1xuICAgIHRzY29uZmlnUGF0aHMoKSBhcyBQbHVnaW5PcHRpb24sXG4gICAgSW5zcGVjdCh7XG4gICAgICBvcGVuOiB0cnVlLFxuICAgIH0pLFxuICAgIHJlYWN0KCkgYXMgUGx1Z2luT3B0aW9uLFxuICAgIGR0cyh7XG4gICAgICBpbmNsdWRlOiBbXG4gICAgICAgIFwic3JjL2VkaXRvci9jb21wb25lbnRzL0VkaXRvci50c3hcIixcbiAgICAgICAgXCJzcmMvZWRpdG9yL2NvbXBvbmVudHMvRWRpdG9yV3JhcHBlci50c3hcIixcbiAgICAgICAgXCJzcmMvZWRpdG9yL2hvb2tzL3VzZS1lZGl0b3IudHNcIixcbiAgICAgICAgXCJzcmMvc2hhcmVkL2hvb2tzL3VzZS1kYXRhc291cmNlLnRzeFwiLFxuICAgICAgICBcInNyYy9zaGFyZWQvY29tcG9uZW50cy9QYWdlLnRzeFwiLFxuICAgICAgICBcInNyYy9zaGFyZWQvdXRpbHMvZ2V0LXRoZW1lLWNzcy50c1wiLFxuICAgICAgXSxcbiAgICAgIG91dERpcjogXCJkaXN0L3R5cGVzXCIsXG4gICAgfSksXG4gICAgLy8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgLy8gICBidW5kbGVzaXplKHtcbiAgICAvLyAgICAgbGltaXRzOiBbeyBuYW1lOiBcIioqLypcIiwgbGltaXQ6IFwiMS42IG1CXCIgfV0sXG4gICAgLy8gICB9KSxcbiAgXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgLy8gaW5jbHVkZTogW1wiQHVwc3RhcnQuZ2cvc2RrXCJdLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiArKHByb2Nlc3MuZW52LlBPUlQgPz8gMzAwOCksXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgbG9kYXNoOiBcImxvZGFzaC1lc1wiLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHtcbiAgICAgICAgRWRpdG9yOiBcInNyYy9lZGl0b3IvY29tcG9uZW50cy9FZGl0b3IudHN4XCIsXG4gICAgICAgIEVkaXRvcldyYXBwZXI6IFwic3JjL2VkaXRvci9jb21wb25lbnRzL0VkaXRvcldyYXBwZXIudHN4XCIsXG4gICAgICAgIFBhZ2U6IFwic3JjL3NoYXJlZC9jb21wb25lbnRzL1BhZ2UudHN4XCIsXG4gICAgICAgIC8vIEJyaWNrOiBcInNyYy9zaGFyZWQvY29tcG9uZW50cy9Ccmljay50c3hcIixcbiAgICAgICAgXCJ1c2UtZWRpdG9yXCI6IFwic3JjL2VkaXRvci9ob29rcy91c2UtZWRpdG9yLnRzXCIsXG4gICAgICAgIFwidXNlLWRhdGFzb3VyY2VcIjogXCJzcmMvc2hhcmVkL2hvb2tzL3VzZS1kYXRhc291cmNlLnRzeFwiLFxuICAgICAgICBcImdldC10aGVtZS1jc3NcIjogXCJzcmMvc2hhcmVkL3V0aWxzL2dldC10aGVtZS1jc3MudHNcIixcbiAgICAgIH0sXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiXSxcbiAgICB9LFxuICAgIG1pbmlmeTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiICYmIHByb2Nlc3MuZW52Lk5PTUlOSUZZICE9PSBcIjFcIixcbiAgICAvLyBjc3NNaW5pZnk6IGZhbHNlLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbXG4gICAgICAgIFwicmVhY3QtaWNvbnNcIixcbiAgICAgICAgXCJyZWFjdFwiLFxuICAgICAgICBcInJlYWN0LWRvbVwiLFxuICAgICAgICBcInJlYWN0L2pzeC1ydW50aW1lXCIsXG4gICAgICAgIFwiQHNpbmNsYWlyL3R5cGVib3hcIixcbiAgICAgICAgXCJAdXBzdGFydC5nZy9zdHlsZS1zeXN0ZW1cIixcbiAgICAgICAgXCJAdXBzdGFydC5nZy9zZGtcIixcbiAgICAgICAgXCJsb2Rhc2gtZXNcIixcbiAgICAgICAgXCJsb2Rhc2hcIixcbiAgICAgIF0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IFwiY2h1bmtzL1tuYW1lXS5baGFzaF0uanNcIixcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IFwiYXNzZXRzL1tuYW1lXVtleHRuYW1lXVwiLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogXCJbbmFtZV0uanNcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVQsU0FBUyxvQkFBdUM7QUFDblcsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixPQUFPLGFBQWE7QUFFcEIsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxXQUFXLENBQUMsU0FBUztBQUFBLEVBQ3JCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLGNBQWM7QUFBQSxJQUNkLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQSxJQUNOLElBQUk7QUFBQSxNQUNGLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxRQUFRO0FBQUEsSUFDVixDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtIO0FBQUEsRUFDQSxjQUFjO0FBQUE7QUFBQSxFQUVkO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNLEVBQUUsUUFBUSxJQUFJLFFBQVE7QUFBQSxFQUM5QjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsSUFDZixXQUFXO0FBQUEsSUFDWCxLQUFLO0FBQUEsTUFDSCxPQUFPO0FBQUEsUUFDTCxRQUFRO0FBQUEsUUFDUixlQUFlO0FBQUEsUUFDZixNQUFNO0FBQUE7QUFBQSxRQUVOLGNBQWM7QUFBQSxRQUNkLGtCQUFrQjtBQUFBLFFBQ2xCLGlCQUFpQjtBQUFBLE1BQ25CO0FBQUEsTUFDQSxTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2hCO0FBQUEsSUFDQSxRQUFRLFFBQVEsSUFBSSxhQUFhLGdCQUFnQixRQUFRLElBQUksYUFBYTtBQUFBO0FBQUEsSUFFMUUsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
