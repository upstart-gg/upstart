import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import config from "./site.config.json" with { type: "json" };
import { setupTwindReact } from "@upstart.gg/style-system/twind";
import { createEmptyConfig, type SiteAndPagesConfig } from "@upstart.gg/sdk/shared/site";

setupTwindReact(false);

const hydrate = () =>
  startTransition(() => {
    const url = new URL(window.location.href);
    const resolvedConfig =
      url.searchParams.get("debug") === "true"
        ? createEmptyConfig("A blog about various kind of coffee and also coffee recipes")
        : (config as SiteAndPagesConfig);
    hydrateRoot(
      document.getElementById("root") as HTMLElement,
      <StrictMode>
        <App path={window.location.pathname + window.location.search} config={resolvedConfig} />
      </StrictMode>,
    );
  });

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
