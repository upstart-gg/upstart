import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { setupTwindReact } from "@upstart.gg/style-system/twind";

setupTwindReact(false);

const hydrate = () =>
  startTransition(() => {
    hydrateRoot(
      document.getElementById("root") as HTMLElement,
      <StrictMode>
        <App path={window.location.pathname + window.location.search} />
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
