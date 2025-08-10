import { type SchemaOptions, Type } from "@sinclair/typebox";
import type { alignItems, alignSelf, justifyContent } from "../bricks/props/align";
import type { basicGap } from "../bricks/props/gap";
import type { background, backgroundColor } from "../bricks/props/background";
import type { border, rounding } from "../bricks/props/border";
import type { color, gradientDirection } from "../bricks/props/color";
import type { hidden } from "../bricks/props/common";
import type { cssLength } from "../bricks/props/css-length";
import type { shadow, textShadow } from "../bricks/props/effects";
import type { fontSize, fontSizeXL, textContent } from "../bricks/props/text";
import type { icon, urlOrPageId } from "../bricks/props/string";
import type { padding } from "../bricks/props/padding";
import type { colorPreset } from "../bricks/props/color-preset";
import type { image } from "../bricks/props/image";
import type { direction } from "../bricks/props/direction";
import type { dynamic, queryUse } from "../bricks/props/dynamic";

export interface SchemaTypeMap {
  "styles:background": ReturnType<typeof background>;
  "styles:backgroundColor": ReturnType<typeof backgroundColor>;
  "styles:justifyContent": ReturnType<typeof justifyContent>;
  "styles:alignItems": ReturnType<typeof alignItems>;
  "styles:alignSelf": ReturnType<typeof alignSelf>;
  "styles:fontSize": ReturnType<typeof fontSize>;
  "styles:fontSizeXL": ReturnType<typeof fontSizeXL>;
  "styles:hidden": ReturnType<typeof hidden>;
  "styles:border": ReturnType<typeof border>;
  "styles:padding": ReturnType<typeof padding>;
  "styles:color": ReturnType<typeof color>;
  "styles:direction": ReturnType<typeof direction>;
  "styles:gradientDirection": ReturnType<typeof gradientDirection>;
  "styles:shadow": ReturnType<typeof shadow>;
  "styles:textShadow": ReturnType<typeof textShadow>;
  "styles:cssLength": ReturnType<typeof cssLength>;
  "styles:basicGap": ReturnType<typeof basicGap>;
  "styles:rounding": ReturnType<typeof rounding>;
  "presets:color": ReturnType<typeof colorPreset>;
  "assets:image": ReturnType<typeof image>;
  "content:text": ReturnType<typeof textContent>;
  "content:urlOrPageId": ReturnType<typeof urlOrPageId>;
  "content:dynamic": ReturnType<typeof dynamic>;
  "content:queryUse": ReturnType<typeof queryUse>;
  "assets:icon": ReturnType<typeof icon>;
  // Add other schema mappings here
}

// Create a typed ref helper
export function typedRef<K extends keyof SchemaTypeMap>(
  id: K,
  options: SchemaOptions = {},
): SchemaTypeMap[K] {
  // Force the type to be a TypeBox type
  return Type.Ref(id, { ...options }) as unknown as SchemaTypeMap[K];
}
