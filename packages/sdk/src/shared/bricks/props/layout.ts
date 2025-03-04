import { Type, type Static } from "@sinclair/typebox";
import { groupLayout } from "./_groups";

export const padding = Type.Optional(
  Type.Union(
    [
      Type.Literal("p-0", { title: "None" }),
      Type.Literal("p-1", { title: "Small" }),
      Type.Literal("p-2", { title: "Medium" }),
      Type.Literal("p-4", { title: "Large" }),
      Type.Literal("p-8", { title: "Extra large" }),
      Type.Literal("p-16", { title: "Extra large (v2)" }),
    ],
    {
      default: "p-2",
      title: "Padding",
      description: "Space between the content and the border",
      "ui:field": "enum",
      "ui:display": "select",
    },
  ),
);

export const height = Type.Optional(
  Type.Union([Type.Literal("fixed", { title: "Fixed" }), Type.Literal("auto", { title: "Auto" })]),
);

export const layout = Type.Object(
  {
    height: Type.Optional(
      Type.Union([Type.Literal("fixed", { title: "Fixed" }), Type.Literal("auto", { title: "Auto" })]),
    ),
    padding,
  },
  {
    title: "Layout",
    "ui:field": "layout",
    "ui:responsive": true,
    ...groupLayout,
    default: {
      padding: "p-2",
      height: "fixed",
    },
  },
);

export type LayoutSettings = Static<typeof layout>;
