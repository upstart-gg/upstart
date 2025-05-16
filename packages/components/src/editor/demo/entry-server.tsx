import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { inline, tw } from "@upstart.gg/style-system/twind";

export function render(path: string) {
  // return renderToString(
  //   <StrictMode>
  //     <App path={path} />
  //   </StrictMode>,
  // );
  return inline(
    renderToString(
      <StrictMode>
        <App path={path} />
      </StrictMode>,
    ),
    tw,
  );
}
