import { Type } from "@sinclair/typebox";
import { effects } from "./effects";
import { background, backgroundColor } from "./background";
import { border } from "./border";
import { image } from "./image";
import { padding } from "./padding";
import { color } from "./text";
import { containerLayout } from "./container";

export const commonStyleForDocsOnly = Type.Object({
  effects: effects(),
  background: background(),
  backgroundColor: backgroundColor(),
  color: color(),
  border: border(),
  image: image(),
  padding: padding(),
  layout: containerLayout(),
});
