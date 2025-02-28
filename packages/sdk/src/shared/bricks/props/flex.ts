import { Type, type Static } from "@sinclair/typebox";
import { groupAlign, groupLayout } from "./_groups";

export const flex = Type.Object(
  {
    direction: Type.Union(
      [Type.Literal("flex-row", { title: "Row" }), Type.Literal("flex-col", { title: "Column" })],
      {
        title: "Direction",
        description: "The direction of the container",
        "ui:field": "enum",
        "ui:display": "button-group",
        ...groupLayout,
      },
    ),
    wrap: Type.Union(
      [Type.Literal("flex-wrap", { title: "Wrap" }), Type.Literal("flex-nowrap", { title: "No wrap" })],
      {
        title: "Wrap",
        description: "Wrap items",
        "ui:field": "enum",
        "ui:display": "button-group",
        ...groupLayout,
      },
    ),
    gap: Type.Union(
      [
        Type.Literal("gap-0", { title: "None" }),
        Type.Literal("gap-1", { title: "S" }),
        Type.Literal("gap-2", { title: "M" }),
        Type.Literal("gap-4", { title: "L" }),
        Type.Literal("gap-8", { title: "XL" }),
        Type.Literal("gap-16", { title: "XXL" }),
      ],
      {
        title: "Gap",
        description: "Space between items",
        "ui:field": "enum",
        ...groupLayout,
      },
    ),
    justifyContent: Type.Union(
      [
        Type.Literal("justify-start", { title: "Start" }),
        Type.Literal("justify-center", { title: "Center" }),
        Type.Literal("justify-end", { title: "End" }),
        Type.Literal("justify-between", { title: "Space between" }),
        Type.Literal("justify-around", { title: "Space around" }),
        Type.Literal("justify-evenly", { title: "Evenly distributed" }),
        Type.Literal("justify-stretch", { title: "Stretch" }),
      ],
      {
        title: "Justify",
        ...groupAlign,
        default: "justify-stretch",
      },
    ),
    alignItems: Type.Union(
      [
        Type.Literal("items-start", { title: "Start" }),
        Type.Literal("items-center", { title: "Center" }),
        Type.Literal("items-end", { title: "End" }),
        Type.Literal("items-stretch", { title: "Stretch" }),
      ],
      {
        title: "Alignment",
        ...groupAlign,
        default: "items-stretch",
      },
    ),
  },
  {
    title: "Layout",
    "ui:field": "flex",
    "ui:responsive": true,
    default: {
      direction: "flex-row",
      gap: "gap-1",
      wrap: "flex-wrap",
      justifyContent: "justify-stretch",
      alignItems: "items-stretch",
    },
    ...groupLayout,
  },
);

export type FlexSettings = Static<typeof flex>;

export const flexProps = Type.Object({
  flex,
  children: Type.Array(Type.Any(), {
    "ui:field": "hidden",
  }),
});
