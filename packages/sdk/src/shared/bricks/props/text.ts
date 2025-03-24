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
        Type.Literal("text-2xl", { title: "Extra large (2x)" }),
        Type.Literal("text-3xl", { title: "Extra large (3x)" }),
        Type.Literal("text-4xl", { title: "Extra large (4x)" }),
        Type.Literal("text-5xl", { title: "Extra large (5x)" }),
        Type.Literal("text-6xl", { title: "Extra large (6x)" }),
        Type.Literal("text-7xl", { title: "Extra large (7x)" }),
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

export function color(defaultValue: string | "color-auto" = "color-auto", title = "Text color") {
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

type TextContentOptions = {
  paragraphMode?: "auto" | "hero";
  showInSettings?: boolean;
  disableSizing?: boolean;
  disableAlignment?: boolean;
};

export function textContent(
  title = "Text",
  defaultContent = "some text here",
  {
    paragraphMode = "auto",
    showInSettings,
    disableSizing = false,
    disableAlignment = false,
  }: TextContentOptions = {},
) {
  return prop({
    title,
    $id: "#content:text",
    schema: Type.String({
      default: defaultContent,
      "ui:paragraph-mode": paragraphMode,
      "ui:disable-sizing": disableSizing,
      "ui:disable-alignment": disableAlignment,
      "ui:field": showInSettings ? "string" : "hidden",
    }),
  });
}

export type TextContentSettings = Static<ReturnType<typeof textContent>>;
