import { type SchemaOptions, Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";
import { typedRef } from "~/shared/utils/typed-ref";
import { cssUnits } from "./css-length";
import { StringEnum } from "~/shared/utils/string-enum";

export function padding() {
	return prop({
		title: "Padding",
		schema: StringEnum(
			[
				"p-0",
				"p-px",
				"p-2",
				"p-4",
				"p-6",
				"p-8",
				"p-10",
				"p-12",
				"p-16",
				"p-24",
			],
			{
				$id: "styles:padding",
				enumNames: [
					"No padding",
					"Minimal",
					"S",
					"M",
					"L",
					"XL",
					"2XL",
					"3XL",
					"4XL",
					"6XL",
				],
				description: "Space between the content and the border",
				"ai:instructions":
					"Can be a tailwind class like `p-4` or a custom value like `p-[16px]`.",
				"ui:field": "enum",
				"ui:responsive": true,
				// "ui:advanced": true,
				"ui:styleId": "styles:padding",
			},
		),
	});
}

export function paddingRef(options: SchemaOptions = {}) {
	return typedRef("styles:padding", {
		...options,
		"ui:styleId": "styles:padding",
	});
}

export type PaddingSettings = Static<ReturnType<typeof padding>>;
