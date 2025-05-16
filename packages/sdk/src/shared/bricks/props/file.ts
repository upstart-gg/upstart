import { Type } from "@sinclair/typebox";
import { prop } from "./helpers";

export function file(title = "File") {
  return prop({
    title,
    schema: Type.String({
      format: "data-url",
      "ui:field": "file",
    }),
  });
}
