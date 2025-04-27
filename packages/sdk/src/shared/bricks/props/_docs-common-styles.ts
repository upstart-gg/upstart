import { Type } from "@sinclair/typebox";
import { effects } from "./effects";
import { background, backgroundColor } from "./background";
import { border } from "./border";
import { image } from "./image";
import { padding } from "./padding";
import { color } from "./text";
import { containerLayout } from "./container";
import { optional } from "./helpers";

export const commonStyleForDocsOnly = Type.Object({
  effects: optional(effects()),
  background: optional(background()),
  backgroundColor: optional(backgroundColor()),
  color: optional(color()),
  border: optional(border()),
  padding: optional(padding()),
});
