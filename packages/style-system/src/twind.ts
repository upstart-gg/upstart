import install from "@twind/with-react";
import {
  twind,
  virtual,
  cssom,
  tx as tx$,
  css as css$,
  style as style$,
  apply as apply$,
  injectGlobal as injectGlobal$,
  keyframes as keyframes$,
  observe as observe$,
} from "@twind/core";
import config from "./twind-config.js";
export { getSheet, parse, parseValue } from "@twind/core";
export { default as inline } from "@twind/with-react/inline";

export const colors = config.theme.colors as Record<
  string,
  Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>
>;

function isProd() {
  //@ts-ignore
  if (typeof import.meta.env !== "undefined") {
    //@ts-ignore
    return import.meta.env.PROD ?? false;
  } else if (typeof process !== "undefined" && typeof process.env !== "undefined") {
    return process.env.NODE_ENV === "production";
  }
  return false;
}

// export default install(config, isProd());

export const sheet = typeof document === "undefined" ? virtual() : cssom("style[data-library]");

// @ts-ignore
export const tw = /* #__PURE__ */ twind(
  config,
  // support SSR and use a different selector to not get the twind default style sheet
  sheet,
);

export function setupTwindReact(prod = isProd()) {
  install(config, prod);
  if (typeof globalThis.addEventListener === "function") {
    globalThis.addEventListener("warning", (event) => {
      // @ts-ignore
      const warning = event.detail;
      if (warning?.code === "TWIND_INVALID_CLASS") {
        event.preventDefault();
      }
    });
  }
}

export const tx = /* #__PURE__ */ tx$.bind(tw);
export const css = /* #__PURE__ */ css$.bind(tw);
export const style = /* #__PURE__ */ style$.bind(tw);
export const apply = /* #__PURE__ */ apply$.bind(tw);
export const observe = /* #__PURE__ */ observe$.bind(tw);
export const injectGlobal = /* #__PURE__ */ injectGlobal$.bind(tw);
export const keyframes = /* #__PURE__ */ keyframes$.bind(tw);
