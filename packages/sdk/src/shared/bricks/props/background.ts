import { type SchemaOptions, Type, type Static } from "@sinclair/typebox";
import type { ElementColorType } from "~/shared/themes/color-system";
import { StringEnum } from "~/shared/utils/string-enum";
import { typedRef } from "~/shared/utils/typed-ref";

type BackgroundOptions = {
  title?: string;
  default?: {
    image?: string;
    size?: string;
    repeat?: string;
  };
  colorType?: ElementColorType;
};

export function background(opts: BackgroundOptions = {}) {
  const { default: defValue, ...restOpts } = opts;
  return Type.Object(
    {
      image: Type.Optional(
        Type.String({
          title: "Image",
          description: "The background image. Can be a URL or a data URI",
          format: "image",
          examples: [
            "https://example.com/image.png",
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
          ],
        }),
      ),
      size: Type.Optional(
        StringEnum(["auto", "cover", "contain"], {
          enumNames: ["Auto", "Cover", "Contain"],
          default: defValue?.size ?? "auto",
          "ai:instructions": "Only use this when the image is set.",
        }),
      ),
      repeat: Type.Optional(
        StringEnum(["no-repeat", "repeat", "repeat-x", "repeat-y", "space", "round"], {
          enumNames: ["No repeat", "Repeat", "Repeat horizontally", "Repeat vertically", "Space", "Round"],
          default: defValue?.repeat ?? "no-repeat",
          "ai:instructions": "Only use this when the image is set.",
        }),
      ),
    },
    {
      // $id: "styles:background",
      "ui:styleId": "styles:background",
      "ui:field": "background",
      "ui:group": "background",
      "ui:group:title": "Background",
      title: "Background image",
      // disable for now
      // "ui:show-img-search": true,
      default: defValue,
      ...restOpts,
    },
  );
}

export type BackgroundSettings = Static<ReturnType<typeof background>>;

export function backgroundRef(options: SchemaOptions = {}) {
  return typedRef("styles:background", options);
}

export function backgroundColor(options: SchemaOptions = {}) {
  return Type.String({
    title: "Background color",
    // $id: "styles:backgroundColor",
    "ai:instructions":
      "Can be set to transparent, hex/rgb/rgba color, or classes like `bg-<variant>-<shade>`, variants being primary, secondary, accent and neutral, and shades between 100 and 900. Use bg-<variant>-<shade> classes as much as possible.",
    "ui:field": "color",
    "ui:color-type": "background",
    // "ui:advanced": true,
    "ui:styleId": "styles:backgroundColor",
    "ui:responsive": "desktop",
    ...options,
  });
}

export type BackgroundColorSettings = Static<ReturnType<typeof backgroundColor>>;

export function backgroundColorRef(options: SchemaOptions = {}) {
  return typedRef("styles:backgroundColor", options);
}
