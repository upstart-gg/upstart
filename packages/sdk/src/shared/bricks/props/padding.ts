import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

export function padding(defaultValue = "p-0") {
  return prop({
    title: "Padding",
    $id: "#styles:padding",
    schema: Type.Union(
      [
        Type.Literal("p-0", { title: "None" }),
        Type.Literal("p-1", { title: "Small" }),
        Type.Literal("p-2", { title: "Medium" }),
        Type.Literal("p-4", { title: "Large" }),
        Type.Literal("p-8", { title: "Extra large" }),
        Type.Literal("p-16", { title: "Extra large (2x)" }),
      ],
      {
        default: defaultValue,
        description: "Space between the content and the border",
        "ui:field": "enum",
        "ui:display": "select",
        "ui:responsive": true,
      },
    ),
  });
}

export type PaddingSettings = Static<ReturnType<typeof padding>>;
