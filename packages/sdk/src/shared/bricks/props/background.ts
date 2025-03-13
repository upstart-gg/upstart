import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

type BackgroundOptions = {
  title?: string;
  defaultValue?: {
    color?: string;
    image?: string;
    size?: string;
    repeat?: string;
  };
};

export function background(opts: BackgroundOptions = {}) {
  const {
    title = "Background",
    defaultValue = {
      size: "auto",
      repeat: "no-repeat",
      color: "transparent",
    },
  } = opts;
  return prop({
    $id: "#styles:background",
    title,
    schema: Type.Object(
      {
        color: Type.Optional(
          Type.String({
            default: defaultValue.color ?? "transparent",
            title: "Color",
          }),
        ),
        image: Type.Optional(
          Type.String({
            title: "Image",
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
            },
          ),
        ),
      },
      {
        "ui:field": "background",
        "ui:group": "background",
        "ui:group:title": "Background",
        "ui:show-img-search": true,
        "ui:inspector-tab": "style",
        default: {
          color: defaultValue.color ?? "transparent",
          size: defaultValue.size ?? "auto",
          repeat: defaultValue.repeat ?? "no-repeat",
        },
      },
    ),
  });
}

export type BackgroundSettings = Static<ReturnType<typeof background>>;

export function backgroundColor(defaultValue = "transparent", title = "Background color") {
  return prop({
    title,
    $id: "#styles:backgroundColor",
    schema: Type.String({
      default: defaultValue,
      "ui:field": "color",
      "ui:color-type": "background",
    }),
  });
}

export type BackgroundColorSettings = Static<ReturnType<typeof backgroundColor>>;
