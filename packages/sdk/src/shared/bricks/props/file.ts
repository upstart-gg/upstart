import { Type } from "@sinclair/typebox";

export function file(title = "File") {
  return Type.String({
    title,
    format: "data-url",
    "ui:field": "file",
  });
}
