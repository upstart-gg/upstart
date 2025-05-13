import { type Static, Type, type StringOptions } from "@sinclair/typebox";
import { prop } from "./helpers";

export function cssLength(
  title: string,
  defaultValue?: string,
  options: Omit<StringOptions, "default"> = {},
) {
  return prop({
    title,
    schema: Type.String({
      title,
      default: defaultValue,
      ...options,
      pattern: "^[0-9.]+(lh|rlh|px|em|rem|%|dvh|vh|vw|dvw|cqw|cqh|cqi|cqb|cqmin|cqmax)$",
      "ui:field": "csslength",
    }),
  });
}

export type CssLength = Static<ReturnType<typeof cssLength>>;
