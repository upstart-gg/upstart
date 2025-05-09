import { Type } from "@sinclair/typebox";
import { effects, shadow } from "./effects";
import { background, backgroundColor } from "./background";
import { border } from "./border";
import { image } from "./image";
import { padding } from "./padding";
import { color } from "./text";
import { containerLayout } from "./container";
import { optional } from "./helpers";
import { preset } from "./preset";

export const commonStyleForDocsOnly = Type.Object({
  background: optional(background()),
  backgroundColor: optional(backgroundColor()),
  color: optional(color()),
  border: optional(border()),
  padding: optional(padding()),
  effects: optional(effects()),
  shadow: optional(shadow()),
});

export const shortDocumentedForDocsOnly = Type.Object({
  preset: optional(preset()),
});
