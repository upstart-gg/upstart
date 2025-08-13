import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { inline, tw } from "@upstart.gg/style-system/twind";
import config from "./site.config.json" with { type: "json" };
import type { SiteAndPagesConfig } from "@upstart.gg/sdk/shared/site";

export function render(path: string) {
  return inline(
    renderToString(
      <StrictMode>
        <App path={path} config={config as SiteAndPagesConfig} />
      </StrictMode>,
    ),
    tw,
  );
}
