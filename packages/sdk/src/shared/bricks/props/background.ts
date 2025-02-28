import { Type, type Static } from "@sinclair/typebox";
import { groupColors } from "./_groups";

export const background = Type.Object(
  {
    color: Type.Optional(
      Type.String({
        default: "transparent",
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
          default: "auto",
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
          default: "no-repeat",
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
    title: "Background",
    default: {
      size: "auto",
      repeat: "no-repeat",
    },
  },
);

export type BackgroundSettings = Static<typeof background>;

export const backgroundColor = Type.String({
  $id: "backgroundColor",
  default: "transparent",
  title: "Background color",
  "ui:field": "color",
  "ui:color-type": "background",
  ...groupColors,
});
