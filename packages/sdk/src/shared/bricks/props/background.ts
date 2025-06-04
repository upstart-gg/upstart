import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";
import type { ElementColorType } from "~/shared/themes/color-system";

type BackgroundOptions = {
  title?: string;
  defaultValue?: {
    color?: string;
    image?: string;
    size?: string;
    repeat?: string;
  };
  colorType?: ElementColorType;
};

export function background(opts: BackgroundOptions = {}) {
  const {
    title = "Background",
    defaultValue = {
      // size: "auto",
      // repeat: "no-repeat",
      // color: "transparent",
    },
    colorType = "background",
  } = opts;
  return prop({
    title,
    schema: Type.Object(
      {
        color: Type.Optional(
          Type.String({
            default: defaultValue.color,
            title: "Color",
            description:
              "Use `bg-<variant>-<shade>`, variants being 'primary', 'secondary', 'accent' and 'neutral', and shades between 50 and 900. Can also be a gradient using 'bg-gradient-to-<direction> from-<color> to-<color>'",
            "ai:examples": ["bg-primary", "bg-base-100", "bg-primary-50", "bg-primary-500", "bg-accent-900"],
          }),
        ),
        image: Type.Optional(
          Type.String({
            title: "Image",
            description: "The background image. Can be a URL or a data URI",
            "ai:examples": [
              "https://example.com/image.png",
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
            ],
          }),
        ),
        size: Type.Optional(
          Type.Union(
            [
              Type.Literal("auto", { title: "Auto" }),
              Type.Literal("cover", { title: "Cover" }),
              Type.Literal("contain", { title: "Contain" }),
            ],
            {
              default: defaultValue.size ?? "auto",
              "ai:instructions": "Only use this when the image is set.",
            },
          ),
        ),
        repeat: Type.Optional(
          Type.Union(
            [
              Type.Literal("no-repeat", { title: "No repeat" }),
              Type.Literal("repeat", { title: "Repeat" }),
              Type.Literal("repeat-x", { title: "Repeat horizontally" }),
              Type.Literal("repeat-y", { title: "Repeat vertically" }),
              Type.Literal("space", { title: "Space" }),
              Type.Literal("round", { title: "Round" }),
            ],
            {
              default: defaultValue.repeat ?? "no-repeat",
              "ai:instructions": "Only use this when the image is set.",
            },
          ),
        ),
      },
      {
        "ui:styleId": "#styles:background",
        "ui:field": "background",
        "ui:group": "background",
        "ui:group:title": "Background",
        "ui:color-type": colorType,
        // disable for now
        // "ui:show-img-search": true,
        default: {
          color: defaultValue.color,
          size: defaultValue.size,
          repeat: defaultValue.repeat,
        },
      },
    ),
  });
}

export type BackgroundSettings = Static<ReturnType<typeof background>>;

export function backgroundColor(defaultValue?: string, title = "Background color") {
  return prop({
    title,
    schema: Type.String({
      "ai:instructions":
        "Can be set to transparent, hex/rgb/rgba color, or classes like `bg-<variant>-<shade>`, variants being primary, secondary, accent and neutral, and shades between 100 and 900. Use bg-<variant>-<shade> classes as much as possible.",
      default: defaultValue,
      "ui:field": "color",
      "ui:color-type": "background",
      "ui:styleId": "#styles:backgroundColor",
    }),
  });
}

export type BackgroundColorSettings = Static<ReturnType<typeof backgroundColor>>;
