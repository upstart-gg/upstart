import {
	type SchemaOptions,
	type Static,
	type TRef,
	Type,
} from "@sinclair/typebox";
import type { preset } from "../bricks/props/preset";
import type { background, backgroundColor } from "../bricks/props/background";
import type { basicAlign } from "../bricks/props/align";
import type { containerLayout } from "../bricks/props/container";
import type { hidden } from "../bricks/props/common";
import type { border } from "../bricks/props/border";
import type { padding } from "../bricks/props/padding";
import type { image } from "../bricks/props/image";
import type { color } from "../bricks/props/color";
import type { shadow } from "../bricks/props/effects";
import type { textContent } from "../bricks/props/text";
import type { cssLength } from "../bricks/props/css-length";
import type { urlOrPageId } from "../bricks/props/string";

export interface SchemaTypeMap {
	"styles:preset": ReturnType<typeof preset>;
	"styles:background": ReturnType<typeof background>;
	"styles:backgroundColor": ReturnType<typeof backgroundColor>;
	"styles:basicAlign": ReturnType<typeof basicAlign>;
	"styles:containerLayout": ReturnType<typeof containerLayout>;
	"styles:hidden": ReturnType<typeof hidden>;
	"styles:border": ReturnType<typeof border>;
	"styles:padding": ReturnType<typeof padding>;
	"styles:color": ReturnType<typeof color>;
	"styles:shadow": ReturnType<typeof shadow>;
	"styles:cssLength": ReturnType<typeof cssLength>;
	"assets:image": ReturnType<typeof image>;
	"content:text": ReturnType<typeof textContent>;
	"content:urlOrPageId": ReturnType<typeof urlOrPageId>;
	// Add other schema mappings here
}

// Create a typed ref helper
export function typedRef<K extends keyof SchemaTypeMap>(
	id: K,
	options: SchemaOptions = {},
): SchemaTypeMap[K] {
	// biome-ignore lint/suspicious/noExplicitAny: Force inference of Ref to the correct type
	return Type.Ref(id, { "ui:styleId": id, ...options }) as any;
}
