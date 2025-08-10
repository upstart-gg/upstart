import { type StringOptions, Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/string-enum";
import { typedRef } from "~/shared/utils/typed-ref";

type Options = StringOptions & {
  "ui:no-extra-large-sizes"?: boolean;
};

export function fontSize(options: Options = {}) {
  return StringEnum(["inherit", "text-xs", "text-sm", "text-base", "text-lg", "text-xl"], {
    enumNames: ["Same as parent", "Extra small", "Small", "Medium", "Large", "Extra large"],
    default: "inherit",
    title: "Font size",
    $id: "styles:fontSize",
    "ui:styleId": "styles:fontSize",
    "ui:field": "enum",
    "ui:display": "select",
    ...options,
  });
}

export type FontSizeSettings = Static<ReturnType<typeof fontSize>>;

export function fontSizeRef(options: Options = {}) {
  return typedRef("styles:fontSize", options);
}

export function fontSizeXL(options: Options = {}) {
  return StringEnum(
    [
      "inherit",
      "text-xs",
      "text-sm",
      "text-base",
      "text-lg",
      "text-xl",
      "text-2xl",
      "text-3xl",
      "text-4xl",
      "text-5xl",
      "text-6xl",
      "text-7xl",
    ],
    {
      enumNames: [
        "Same as parent",
        "Extra small",
        "Small",
        "Medium",
        "Large",
        "Extra large",
        "Extra large (2x)",
        "Extra large (3x)",
        "Extra large (4x)",
        "Extra large (5x)",
        "Extra large (6x)",
        "Extra large (7x)",
      ],
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
export function fontSizeXLRef(options: Options = {}) {
  return typedRef("styles:fontSizeXL", options);
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
  ...rest
}: TextContentOptions & StringOptions = {}) {
  return Type.String({
    title,
    description:
      "Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>.",
    $id: "content:text",
    default: defaults ?? "My text",
    "ui:disable-sizing": disableSizing,
    "ui:disable-alignment": disableAlignment,
    metadata: {
      category: "content",
    },
    ...rest,
    // "ui:field": showInSettings ? "string" : "hidden",
  });
}

export type TextContentSettings = Static<ReturnType<typeof textContent>>;

export function textContentRef(options: TextContentOptions & StringOptions = {}) {
  return typedRef("content:text", options);
}
