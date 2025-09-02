import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { inline, tw } from "@upstart.gg/style-system/twind";
import config from "./site.config.json" with { type: "json" };
import { createEmptyConfig, type SiteAndPagesConfig } from "@upstart.gg/sdk/shared/site";

export function render(url: URL) {
  const path = url.pathname;
  const appConfig =
    url.searchParams.get("debug") === "true"
      ? createEmptyConfig("A blog about various kind of coffee and also coffee recipes")
      : (config as SiteAndPagesConfig);
  return inline(
    renderToString(
      <StrictMode>
        <App path={path} config={appConfig} />
      </StrictMode>,
    ),
    tw,
  );
}
