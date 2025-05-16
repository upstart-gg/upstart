import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

export function fontSize(defaultValue = "inherit", title = "Font size") {
  return prop({
    title,
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
        "ui:styleId": "#styles:fontSize",
        "ui:field": "enum",
        "ui:display": "select",
      },
    ),
  });
}

export type FontSizeSettings = Static<ReturnType<typeof fontSize>>;

export function color(defaultValue?: string, title = "Text color") {
  return prop({
    title,
    schema: Type.String({
      "ai:instructions":
        "hex/rgb/rgba color or classes like `text-<variant>-<shade>`, variants being `primary`, `secondary`, `accent` and `neutral`, and shades between 50 and 900",
      default: defaultValue,
      "ui:styleId": "#styles:color",
      "ui:field": "color",
      "ui:color-type": "text",
    }),
  });
}

export type ColorSettings = Static<ReturnType<typeof color>>;

type TextContentOptions = {
  showInSettings?: boolean;
  disableSizing?: boolean;
  disableAlignment?: boolean;
};

export function textContent(
  title = "Text",
  defaultContent?: string,
  { showInSettings, disableSizing = false, disableAlignment = false }: TextContentOptions = {},
) {
  return prop({
    title,
    description:
      "Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>.",
    schema: Type.String({
      default: defaultContent,
      "ui:disable-sizing": disableSizing,
      "ui:disable-alignment": disableAlignment,
      "ui:field": showInSettings ? "string" : "hidden",
    }),
  });
}

export type TextContentSettings = Static<ReturnType<typeof textContent>>;
