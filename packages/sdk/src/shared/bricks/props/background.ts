import { type SchemaOptions, Type, type Static } from "@sinclair/typebox";
import type { ElementColorType } from "~/shared/themes/color-system";
import { StringEnum } from "~/shared/utils/string-enum";

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
  return Type.Object(
    {
      image: Type.String({
        title: "Image",
        description: "The background image. Can be a URL or a data URI",
        format: "image",
        examples: ["https://example.com/image.png"],
      }),
      size: Type.Optional(
        StringEnum(["auto", "cover", "contain"], {
          enumNames: ["Auto", "Cover", "Contain"],
          "ai:instructions": "Only use this when the image is set.",
        }),
      ),
      repeat: Type.Optional(
        StringEnum(["no-repeat", "repeat", "repeat-x", "repeat-y", "space", "round"], {
          enumNames: ["No repeat", "Repeat", "Repeat horizontally", "Repeat vertically", "Space", "Round"],
          "ai:instructions": "Only use this when the image is set.",
        }),
      ),
    },
    {
      // $id: "styles:background",
      "ui:styleId": "styles:background",
      "ui:field": "background",
      title: "Background image",
      // disable for now
      // "ui:show-img-search": true,
      ...opts,
    },
  );
}

export type BackgroundSettings = Static<ReturnType<typeof background>>;

export function backgroundColor(options: SchemaOptions = {}) {
  return Type.String({
    title: "Background color",
    // $id: "styles:backgroundColor",
    "ai:instructions":
      "Must be formated like `bg-<variant>-<shade>`, variants being primary, secondary, accent and neutral, or base and shades between 100 and 900, except the base with takes shades betwen 100 and 300 only.",
    pattern: "^bg-(primary|secondary|accent|neutral|base)-?(50|100|200|300|400|500|600|700|800|900)?$",
    "ui:field": "color",
    "ui:color-type": "background",
    // "ui:advanced": true,
    "ui:styleId": "styles:backgroundColor",
    "ui:responsive": "desktop",
    ...options,
  });
}

export type BackgroundColorSettings = Static<ReturnType<typeof backgroundColor>>;
