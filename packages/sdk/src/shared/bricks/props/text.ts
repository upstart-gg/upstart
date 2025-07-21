import { type StringOptions, Type, type Static } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";

type Options = StringOptions & {
  "ui:no-extra-large-sizes"?: boolean;
};

export function fontSize(options: Options = {}) {
  return Type.Union(
    [
      Type.Literal("inherit", { title: "Same as parent" }),
      Type.Literal("text-xs", { title: "Extra small" }),
      Type.Literal("text-sm", { title: "Small" }),
      Type.Literal("text-base", { title: "Medium" }),
      Type.Literal("text-lg", { title: "Large" }),
      Type.Literal("text-xl", { title: "Extra large", "ui:extra-large": true }),
      Type.Literal("text-2xl", { title: "Extra large (2x)", "ui:extra-large": true }),
      Type.Literal("text-3xl", { title: "Extra large (3x)", "ui:extra-large": true }),
      Type.Literal("text-4xl", { title: "Extra large (4x)", "ui:extra-large": true }),
      Type.Literal("text-5xl", { title: "Extra large (5x)", "ui:extra-large": true }),
      Type.Literal("text-6xl", { title: "Extra large (6x)", "ui:extra-large": true }),
      Type.Literal("text-7xl", { title: "Extra large (7x)", "ui:extra-large": true }),
    ],
    {
      default: "inherit",
      title: "Font size",
      $id: "styles:fontSize",
      "ui:styleId": "styles:fontSize",
      "ui:field": "enum",
      "ui:display": "select",
      ...options,
    },
  );
}

export type FontSizeSettings = Static<ReturnType<typeof fontSize>>;

export function fontSizeRef(options: Options = {}) {
  return typedRef("styles:fontSize", {
    ...options,
    "ui:styleId": "styles:fontSize",
  });
}

type TextContentOptions = {
  showInSettings?: boolean;
  disableSizing?: boolean;
  disableAlignment?: boolean;
};

export function textContent({
  title = "Text",
  default: defaults,
  showInSettings,
  disableSizing = false,
  disableAlignment = false,
}: TextContentOptions & StringOptions = {}) {
  return Type.String({
    title,
    description:
      "Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>.",
    $id: "content:text",
    default: defaults ?? "My text",
    "ui:disable-sizing": disableSizing,
    "ui:disable-alignment": disableAlignment,
    "ui:field": showInSettings ? "string" : "hidden",
  });
}

export type TextContentSettings = Static<ReturnType<typeof textContent>>;

export function textContentRef(options: TextContentOptions & StringOptions = {}) {
  return typedRef("content:text", options);
}
