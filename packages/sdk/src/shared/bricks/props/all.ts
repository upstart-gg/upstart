import { Type, type Static, type TSchema } from "@sinclair/typebox";
import { stylePreset } from "./_style-presets";
import { height, layout } from "./layout";
import { border } from "./border";
import { effects } from "./effects";
import { background } from "./background";
import { text } from "./text";
import { align } from "./align";
import { containerLayoutProps } from "./container";

export const commonProps = Type.Object({
  // id: Type.String({
  //   title: "Brick ID",
  //   "ui:field": "hidden",
  // }),
  className: Type.Optional(
    Type.String({
      default: "",
      "ui:field": "hidden",
    }),
  ),
  lastTouched: Type.Optional(
    Type.Number({
      default: 0,
      "ui:field": "hidden",
    }),
  ),
  editable: Type.Optional(
    Type.Boolean({
      description: "Allow editing. It is automatically set by the editor, so no need to specify it manually.",
      default: false,
      "ui:field": "hidden",
    }),
  ),
  stylePreset,
  isDynamic: Type.Optional(
    Type.Boolean({
      title: "Use dynamic content",
      description:
        "Content can be managed in two ways: Static or Dynamic. Static content is set in the editor. Dynamic content is fetched from a database and can be managed through our CMS.",
      default: false,
      "ui:field": "dynamic-content-switch",
      "ui:inspector-tab": "content",
      "ui:order": 0,
      "ui:group:order": 0,
      "ui:group": "content",
      "ui:group:title": "Dynamic / Static Mode",
    }),
  ),
});

export type CommonProps = Static<typeof commonProps>;

export const commonStyleProps = Type.Object({
  layout: Type.Optional(layout),
  border: Type.Optional(border),
  effects: Type.Optional(effects),
  background: Type.Optional(background),
  text: Type.Optional(text),
});

/**
 * All style props that can be applied to a brick
 */
export const allStyleProps = Type.Partial(
  Type.Composite([
    containerLayoutProps,
    Type.Object({
      align,
      layout,
      height,
      border,
      effects,
      background,
      text,
    }),
  ]),
);

export type AllStyleProps = Static<typeof allStyleProps>;
export type StyleProp = keyof Required<AllStyleProps>;
