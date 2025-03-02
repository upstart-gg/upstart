import { Type, type Static, type TSchema } from "@sinclair/typebox";
import { stylePreset } from "./_style-presets";
import { layout } from "./layout";
import { border } from "./border";
import { effects } from "./effects";
import { background } from "./background";
import { text } from "./text";

export const commonProps = Type.Object({
  id: Type.String({
    title: "Brick ID",
    "ui:field": "hidden",
  }),
  className: Type.String({
    default: "",
    "ui:field": "hidden",
  }),
  lastTouched: Type.Number({
    default: 0,
    "ui:field": "hidden",
  }),
  editable: Type.Boolean({
    description: "Allow editing. It is automatically set by the editor, so no need to specify it manually.",
    default: false,
    "ui:field": "hidden",
  }),
  stylePreset,
  isDynamic: Type.Boolean({
    title: "Use dynamic content",
    description:
      "Content of this brick can be managed in two ways: Static or Dynamic. Static content is set in the editor. Dynamic content is fetched from a database and can be managed through our CMS.",
    default: false,
    "ui:field": "dynamic-content-switch",
    "ui:inspector-tab": "content",
    "ui:order": 0,
    "ui:group:order": 0,
    "ui:group": "content",
    "ui:group:title": "Dynamic / Static Mode",
  }),
  childrenBricks: Type.Array(Type.Any(), {
    "ui:field": "hidden",
    default: [],
  }),
});

/**
 * No margin in common style props as bricks are usually placed in a grid
 */
export const commonStyleProps = Type.Object({
  layout,
  border,
  effects,
  background,
  text,
});
