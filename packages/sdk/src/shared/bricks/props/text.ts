import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

export function fontSize(defaultValue = "inherit", title = "Font size") {
  return prop({
    title,
    $id: "#styles:fontSize",
    schema: Type.Union(
      [
        Type.Literal("inherit", { title: "Inherit from parent" }),
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
        default: defaultValue,
        "ui:field": "enum",
        "ui:display": "select",
        "ui:inspector-tab": "style",
      },
    ),
  });
}

export type FontSizeSettings = Static<ReturnType<typeof fontSize>>;

export function color(defaultValue: string | "auto" = "auto", title = "Text color") {
  return prop({
    title,
    $id: "#styles:color",
    schema: Type.String({
      default: defaultValue,
      "ui:field": "color",
      "ui:color-type": "text",
      "ui:inspector-tab": "style",
    }),
  });
}

export type ColorSettings = Static<ReturnType<typeof color>>;

export function textContent(
  title = "Text",
  defaultContent = "some text here",
  paragraphMode: "auto" | "hero" = "auto",
) {
  return prop({
    title,
    $id: "#content:text",
    schema: Type.String({
      default: defaultContent,
      "ui:paragraph-mode": paragraphMode,
      "ui:field": "hidden",
    }),
  });
}

export type TextContentSettings = Static<ReturnType<typeof textContent>>;
