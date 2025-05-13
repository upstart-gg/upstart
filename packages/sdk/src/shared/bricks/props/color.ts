import { Type, type StringOptions } from "@sinclair/typebox";
import { prop } from "./helpers";

export function color(title = "Color", options?: StringOptions) {
  return prop({
    title,
    schema: Type.String({
      "ui:field": "color",
      ...options,
    }),
  });
}
