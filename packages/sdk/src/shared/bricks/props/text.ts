import { type StringOptions, Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";
import { typedRef } from "~/shared/utils/typed-ref";

type Options = {
  noExtraLargeSizes?: boolean;
};

export function fontSize(defaultValue = "inherit", title = "Font size", options: Options = {}) {
  return prop({
    title,
    schema: Type.Union(
      [
        Type.Literal("inherit", { title: "Same as parent" }),
        Type.Literal("text-xs", { title: "Extra small" }),
        Type.Literal("text-sm", { title: "Small" }),
        Type.Literal("text-base", { title: "Medium" }),
        Type.Literal("text-lg", { title: "Large" }),
        ...(!options.noExtraLargeSizes
          ? [
              Type.Literal("text-xl", { title: "Extra large" }),
              Type.Literal("text-2xl", { title: "Extra large (2x)" }),
              Type.Literal("text-3xl", { title: "Extra large (3x)" }),
              Type.Literal("text-4xl", { title: "Extra large (4x)" }),
              Type.Literal("text-5xl", { title: "Extra large (5x)" }),
              Type.Literal("text-6xl", { title: "Extra large (6x)" }),
              Type.Literal("text-7xl", { title: "Extra large (7x)" }),
            ]
          : []),
      ],
      {
        default: defaultValue,
        "ui:styleId": "styles:fontSize",
        "ui:field": "enum",
        "ui:display": "select",
      },
    ),
  });
}

export type FontSizeSettings = Static<ReturnType<typeof fontSize>>;

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
  return prop({
    title,
    description:
      "Text content. Can contain basic HTML tags like `<strong>`, `<em>`, `<br>` and `<a>` as well as `<p>` and `<span>` and lists <ul> <ol> <li>.",
    schema: Type.String({
      $id: "content:text",
      default: defaults ?? "My text",
      "ui:disable-sizing": disableSizing,
      "ui:disable-alignment": disableAlignment,
      "ui:field": showInSettings ? "string" : "hidden",
    }),
  });
}

export type TextContentSettings = Static<ReturnType<typeof textContent>>;

export function textContentRef(options: TextContentOptions & StringOptions = {}) {
  return typedRef("content:text", options);
}
