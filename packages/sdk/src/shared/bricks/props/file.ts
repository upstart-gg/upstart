import { Type } from "@sinclair/typebox";

export function file(title = "File") {
  return Type.String({
    title,
    format: "file-url",
    "ui:field": "file",
    examples: ["https://example.com/file.pdf"],
  });
}
