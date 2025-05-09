import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

export function padding(defaultValue = "p-0") {
  return prop({
    title: "Padding",
    schema: Type.Union(
      [
        Type.Literal("p-0", { title: "None" }),
        Type.Literal("p-1", { title: "S" }),
        Type.Literal("p-2", { title: "M" }),
        Type.Literal("p-4", { title: "L" }),
        Type.Literal("p-8", { title: "XL" }),
        Type.Literal("p-16", { title: "2XL" }),
      ],
      {
        default: defaultValue,
        description: "Space between the content and the border",
        "ui:field": "enum",
        "ui:responsive": true,
        "ui:styleId": "#styles:padding",
      },
    ),
  });
}

export type PaddingSettings = Static<ReturnType<typeof padding>>;
