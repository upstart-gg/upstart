import { Type, type SchemaOptions } from "@sinclair/typebox";

export function grow(options: SchemaOptions = {}) {
  return Type.Boolean({
    title: "Auto expand",
    description: "If set, the brick will grow to fill the available space of its parent section or box.",
    "ui:styleId": "styles:grow",
    "ui:responsive": true,
    ...options,
  });
}
