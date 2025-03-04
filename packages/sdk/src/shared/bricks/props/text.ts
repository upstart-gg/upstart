import { Type, type Static } from "@sinclair/typebox";

const fontSize = Type.Union(
  [
    Type.Literal("inherit", { title: "Inherit from page/container" }),
    Type.Literal("text-xs", { title: "Extra small" }),
    Type.Literal("text-sm", { title: "Small" }),
    Type.Literal("text-base", { title: "Base size" }),
    Type.Literal("text-lg", { title: "Large" }),
    Type.Literal("text-xl", { title: "Extra large" }),
    Type.Literal("text-2xl", { title: "Extra large (x2)" }),
    Type.Literal("text-3xl", { title: "Extra large (x3)" }),
    Type.Literal("text-4xl", { title: "Extra large (x4)" }),
    Type.Literal("text-5xl", { title: "Extra large (x5)" }),
    Type.Literal("text-6xl", { title: "Extra large (x6)" }),
    Type.Literal("text-7xl", { title: "Extra large (x7)" }),
  ],
  {
    default: "inherit",
    title: "Default size",
    "ui:field": "enum",
    "ui:display": "select",
    "ui:group": "text",
    "ui:inspector-tab": "style",
  },
);

const color = Type.String({
  default: "transparent",
  title: "Text color",
  "ui:field": "color",
  "ui:color-type": "text",
  "ui:group": "text",
  "ui:inspector-tab": "style",
});

export const text = Type.Object(
  {
    size: Type.Optional(fontSize),
    color: Type.Optional(color),
  },
  {
    title: "Text style",
    "ui:field": "text",
    "ui:group": "text",
    "ui:group:title": "Text",
    "ui:responsive": true,
    "ui:inspector-tab": "style",

    default: {
      size: "text-base",
      color: "inherit",
    },
  },
);

export type TextStyleProps = Static<typeof text>;

const textAlign = Type.Optional(
  Type.Union(
    [
      Type.Literal("text-left", { title: "Left", description: "Left align" }),
      Type.Literal("text-center", { title: "Center", description: "Center align" }),
      Type.Literal("text-right", { title: "Right", description: "Right align" }),
      Type.Literal("text-justify", { title: "Justify", description: "Justify align" }),
    ],
    {
      $id: "textAlign",
      default: "text-left",
      title: "Text alignment",
      description: "The text alignment",
      "ui:field": "enum",
      "ui:group": "text",
      "ui:inspector-tab": "style",
    },
  ),
);

const fontWeight = Type.Union(
  [
    Type.Literal("font-normal", { title: "1" }),
    Type.Literal("font-medium", { title: "2" }),
    Type.Literal("font-semibold", { title: "3" }),
    Type.Literal("font-bold", { title: "4" }),
    Type.Literal("font-extrabold", { title: "5" }),
  ],
  {
    $id: "fontWeight",
    default: "font-normal",
    title: "Font weight",
    description: "The text font weight",
    "ui:field": "enum",
    "ui:display": "button-group",
    "ui:group": "text",
    "ui:inspector-tab": "style",
  },
);

export const textContent = Type.String({
  default: "some text here",
  "ui:paragraph-mode": "auto",
  "ui:field": "hidden",
  "ui:group": "content",
  "ui:group:title": "Content",
  "ui:group:order": 3,
});

export const textContentProps = Type.Object({
  textContent,
});

export type TextContent = Static<typeof textContent>;
export type TextContentProps = Static<typeof textContentProps>;
