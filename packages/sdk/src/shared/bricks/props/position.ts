import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

export function position(defaultValue = "flowing", title = "Position") {
	return prop({
		title,
		schema: Type.Union(
			[
				Type.Literal("flowing", { title: "Flowing" }),
				Type.Literal("fixed", { title: "Fixed" }),
				Type.Literal("sticky", { title: "Sticky" }),
			],
			{ default: defaultValue, "ui:styleId": "styles:position" },
		),
	});
}

export type PositionSettings = Static<ReturnType<typeof position>>;

export function fixedPositioned(
	defaultValue = false,
	title = "Fixed position",
) {
	return prop({
		title,
		schema: Type.Boolean({
			default: defaultValue,
			"ui:styleId": "styles:fixedPositioned",
		}),
	});
}

export type FixedPositionedSettings = Static<
	ReturnType<typeof fixedPositioned>
>;
