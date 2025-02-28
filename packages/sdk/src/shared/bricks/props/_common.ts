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
  hasDynamicContent: Type.Boolean({
    title: "Dynamic Content",
    default: false,
    "ui:field": "dynamic-content-switch",
    "ui:inspector-tab": "content",
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
