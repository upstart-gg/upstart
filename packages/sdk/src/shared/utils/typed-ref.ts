import { type SchemaOptions, type Static, type TRef, Type } from "@sinclair/typebox";
import type { colorPreset, preset } from "../bricks/props/preset";
import type { background, backgroundColor } from "../bricks/props/background";
import type { basicAlign } from "../bricks/props/align";
import type { hidden } from "../bricks/props/common";
import type { border } from "../bricks/props/border";
import type { padding } from "../bricks/props/padding";
import type { image } from "../bricks/props/image";
import type { color } from "../bricks/props/color";
import type { shadow, textShadow } from "../bricks/props/effects";
import type { fontSize, textContent } from "../bricks/props/text";
import type { cssLength } from "../bricks/props/css-length";
import type { icon, urlOrPageId } from "../bricks/props/string";

export interface SchemaTypeMap {
  "styles:preset": ReturnType<typeof preset>;
  "styles:background": ReturnType<typeof background>;
  "styles:backgroundColor": ReturnType<typeof backgroundColor>;
  "styles:basicAlign": ReturnType<typeof basicAlign>;
  "styles:fontSize": ReturnType<typeof fontSize>;
  "styles:hidden": ReturnType<typeof hidden>;
  "styles:border": ReturnType<typeof border>;
  "styles:padding": ReturnType<typeof padding>;
  "styles:color": ReturnType<typeof color>;
  "styles:shadow": ReturnType<typeof shadow>;
  "styles:textShadow": ReturnType<typeof textShadow>;
  "styles:cssLength": ReturnType<typeof cssLength>;
  "presets:color": ReturnType<typeof colorPreset>;
  "assets:image": ReturnType<typeof image>;
  "content:text": ReturnType<typeof textContent>;
  "content:urlOrPageId": ReturnType<typeof urlOrPageId>;
  "assets:icon": ReturnType<typeof icon>;
  // Add other schema mappings here
}

// Create a typed ref helper
export function typedRef<K extends keyof SchemaTypeMap>(
  id: K,
  options: SchemaOptions = {},
): SchemaTypeMap[K] {
  // biome-ignore lint/suspicious/noExplicitAny: Force inference of Ref to the correct type
  return Type.Ref(id, { ...options }) as any;
}
