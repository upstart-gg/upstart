import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export function render(path: string) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
  // return inline(
  //   renderToString(
  //     <StrictMode>
  //       <App path={path} />
  //     </StrictMode>,
  //   ),
  //   tw,
  // );
}
