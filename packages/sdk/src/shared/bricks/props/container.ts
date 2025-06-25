import {
	type TObject,
	Type,
	type Static,
	type SchemaOptions,
} from "@sinclair/typebox";
import {
	getStyleProperties,
	getStyleValueById,
	group,
	optional,
	prop,
} from "./helpers";
import { typedRef } from "~/shared/utils/typed-ref";
import { StringEnum } from "~/shared/utils/string-enum";
import { cssLength } from "./css-length";

// type FlexOptions = {
//   title?: string;
//   defaultValue?: {
//     direction: string;
//     wrap: string;
//     gap: string;
//     justifyContent: string;
//     alignItems: string;
//   };
// };

// export function flex(opts: FlexOptions = {}) {
//   const {
//     title = "Layout",
//     defaultValue = {
//       direction: "flex-row",
//       gap: "gap-1",
//       wrap: "flex-wrap",
//       justifyContent: "justify-stretch",
//       alignItems: "items-stretch",
//     },
//   } = opts;
//   return prop({
//     title,
//     schema: Type.Object(
//       {
//         direction: Type.Optional(
//           StringEnum(["flex-row", "flex-col"], {
//             enumNames: ["Row", "Column"],
//             title: "Direction",
//             description: "The direction of the container.",
//             default: defaultValue.direction,
//           }),
//         ),
//         gap: Type.Optional(
//           Type.String({
//             title: "Gap",
//             description:
//               "Space between items. Can be a tailwind gap class like 'gap-1' or 'gap-2', or a custom value like '10px'",
//             default: defaultValue.gap,
//             // todo: make a specific field for gap
//             // "ui:field": "enum",
//           }),
//         ),
//         wrap: Type.Optional(
//           StringEnum(["flex-wrap", "flex-nowrap"], {
//             enumNames: ["Wrap", "No wrap"],
//             title: "Wrap",
//             description: "Wether to wrap items in the container.",
//             default: defaultValue.wrap,
//           }),
//         ),
//         justifyContent: Type.Optional(
//           StringEnum(
//             [
//               "justify-start",
//               "justify-center",
//               "justify-end",
//               "justify-between",
//               "justify-around",
//               "justify-evenly",
//               "justify-stretch",
//             ],
//             {
//               enumNames: [
//                 "Start",
//                 "Center",
//                 "End",
//                 "Space between",
//                 "Space around",
//                 "Evenly distributed",
//                 "Stretch",
//               ],
//               title: "Justify",
//               description: "Justify content along the main axis (horizontal for row, vertical for column).",
//               default: defaultValue.justifyContent,
//             },
//           ),
//         ),
//         alignItems: Type.Optional(
//           StringEnum(["items-start", "items-center", "items-end", "items-stretch"], {
//             enumNames: ["Start", "Center", "End", "Stretch"],
//             title: "Alignment",
//             description: "Align items along the cross axis (vertical for row, horizontal for column).",
//             default: defaultValue.alignItems,
//           }),
//         ),
//       },
//       {
//         "ui:styleId": "styles:flex",
//         "ui:field": "flex",
//         "ui:responsive": true,
//         default: {
//           direction: defaultValue.direction,
//           gap: defaultValue.gap,
//           wrap: defaultValue.wrap,
//           justifyContent: defaultValue.justifyContent,
//           alignItems: defaultValue.alignItems,
//         },
//       },
//     ),
//   });
// }

// export type FlexSettings = Static<ReturnType<typeof flex>>;

// type GridOptions = {
//   title?: string;
//   defaultValue?: {
//     gap: string;
//     columns: number;
//   };
// };

// export function grid(options: GridOptions = {}) {
//   const { title = "Layout", defaultValue = { gap: "gap-1", columns: 2 } } = options;
//   return prop({
//     title,
//     schema: Type.Object(
//       {
//         columns: Type.Number({
//           title: "Columns",
//           description: "Number of columns",
//           "ui:group": "grid",
//           "ui:field": "slider",
//           default: 2,
//           minimum: 1,
//           maximum: 12,
//         }),
//         gap: Type.Optional(
//           Type.String({
//             title: "Gap",
//             description:
//               "Space between items. Can be a tailwind gap class like 'gap-1' or 'gap-2', or a custom value like '10px'",
//             default: defaultValue.gap,
//             // todo: make a specific field for gap
//             // "ui:field": "enum",
//           }),
//         ),
//       },
//       {
//         "ui:styleId": "styles:grid",
//         "ui:field": "grid",
//         "ui:responsive": true,
//         default: defaultValue,
//       },
//     ),
//   });
// }

// export type GridSettings = Static<ReturnType<typeof grid>>;

const isFlexLayoutFilter = (
	manifestProps: TObject,
	formData: Record<string, unknown>,
) => {
	const stylesProps = getStyleProperties(manifestProps);
	const currentStyle = getStyleValueById<ContainerLayoutSettings>(
		stylesProps,
		formData,
		"styles:containerLayout",
	);
	return currentStyle?.type === "flex" || !currentStyle?.type;
};

const isGridLayoutFilter = (
	manifestProps: TObject,
	formData: Record<string, unknown>,
) => {
	return !isFlexLayoutFilter(manifestProps, formData);
};

type ContainerLayoutOptions = {
	title?: string;
	defaults?: {
		type?: "flex" | "grid";
		gap?: string;
		direction?: string;
		columns?: {
			max?: number;
			default?: number;
		};
		wrap?: boolean;
		fillSpace?: boolean;
		justifyContent?: string;
		alignItems?: string;
	};
	options?: {
		disableGrid?: boolean;
	};
};

function containerlayoutStyle(options: SchemaOptions = {}) {
	return Type.Object(
		{
			...(!options.disableGrid
				? {
						type: StringEnum(["flex", "grid"], {
							enumNames: ["Flex", "Grid"],
							title: "Layout type",
							description:
								"Type of the container. Flex layout arranges items in a one-dimensional line. Grid layout arranges items in a two-dimensional grid",
							"ui:field": "enum",
							"ui:responsive": true,
						}),
					}
				: {}),

			gap: Type.Optional(
				Type.String({
					title: "Gap",
					description:
						"Space between items. Can be a tailwind gap class like 'gap-1' or 'gap-2', or a custom value like '10px'",
					"ui:placeholder": "Not specified",
					// todo: make a specific field for gap
					// "ui:field": "enum",
				}),
			),
			direction: optional(
				StringEnum(["flex-row", "flex-col"], {
					enumNames: ["Row", "Column"],
					title: "Direction",
					description:
						"The direction of the container. Only applies to flex layout",
					metadata: {
						filter: isFlexLayoutFilter,
					},
				}),
			),
			columns: optional(
				Type.Number({
					title: "Columns",
					description: "Number of columns. Only applies to grid layout",
					"ui:field": "slider",
					minimum: 1,
					maximum: 16,
					metadata: {
						filter: isGridLayoutFilter,
					},
				}),
			),
			wrap: optional(
				Type.Boolean({
					title: "Wrap",
					description: "Wrap items.",
					"ai:instructions": "Only applies to flex layout",
					metadata: {
						filter: isFlexLayoutFilter,
					},
				}),
			),
			fillSpace: optional(
				Type.Boolean({
					title: "Fill space",
					description: "Makes items of the container fill the available space",
					"ai:instructions": "Only applies to flex layout",
					metadata: {
						filter: isFlexLayoutFilter,
					},
				}),
			),
			justifyContent: Type.Optional(
				StringEnum(
					[
						"justify-start",
						"justify-center",
						"justify-end",
						"justify-between",
						"justify-around",
						"justify-evenly",
						"justify-stretch",
					],
					{
						enumNames: [
							"Start",
							"Center",
							"End",
							"Space between",
							"Space around",
							"Evenly distributed",
							"Stretch",
						],
						title: "Justify",
						description:
							"Justify content along the main axis (horizontal for row, vertical for column)",
						"ai:instructions": "Only applies to flex layout",
						metadata: {
							filter: isFlexLayoutFilter,
						},
					},
				),
			),

			alignItems: optional(
				Type.Union(
					[
						Type.Literal("items-start", { title: "Start" }),
						Type.Literal("items-center", { title: "Center" }),
						Type.Literal("items-end", { title: "End" }),
						Type.Literal("items-stretch", { title: "Stretch" }),
					],
					{
						title: "Alignment",
						description:
							"Align items along the cross axis (vertical for row, horizontal for column)",
						"ai:instructions": "Only applies to flex layout",
						metadata: {
							filter: isFlexLayoutFilter,
						},
					},
				),
			),
		},
		{ $id: "styles:containerLayout" },
	);
}

export function containerLayout({
	title = "Layout",
	options = {},
}: ContainerLayoutOptions = {}) {
	return group({
		title,
		options: {
			"ui:styleId": "styles:containerLayout",
			$id: "styles:containerLayout",
		},
		children: containerlayoutStyle(options),
	});
}

export type ContainerLayoutSettings = Static<
	ReturnType<typeof containerLayout>
>;

export function containerLayoutRef(options: SchemaOptions = {}) {
	return typedRef("styles:containerLayout", {
		title: "Container layout",
		description: "Settings for the layout of the container",
		...options,
	});
}

export function makeContainerProps() {
	return {
		$childrenType: Type.Optional(
			Type.String({
				title: "Dynamic child brick type",
				description:
					"Type of the child bricks that will be created when container is dynamic",
				"ui:field": "brick-type",
				metadata: {
					category: "content",
				},
			}),
		),
		$children: Type.Array(Type.Any(), {
			"ui:field": "hidden",
			description: "List of nested bricks",
			default: [],
		}),
	};
}

export function sectionLayout(options: SchemaOptions = {}) {
	return Type.Object(
		{
			gap: Type.Optional(
				// Type.String({
				//   title: "Gap",
				//   description:
				//     "Space between items. Can be a tailwind gap class like 'gap-1' or 'gap-2', or a custom value like '10px'",
				//   "ui:placeholder": "Not specified",
				//   // todo: make a specific field for gap
				//   // "ui:field": "enum",
				// }),
				cssLength({
					title: "Gap",
					default: "10px",
					description:
						"Space between items. Can be a tailwind gap class like 'gap-1' or 'gap-2', or a custom value like '10px'",
					"ui:placeholder": "Not specified",
					"ui:styleId": "styles:gap",
				}),
			),
			wrap: optional(
				Type.Boolean({
					title: "Wrap",
					description: "Wrap items.",
				}),
			),
			fillSpace: optional(
				Type.Boolean({
					title: "Fill space",
					description: "Makes items of the container fill the available space",
				}),
			),
			justifyContent: Type.Optional(
				StringEnum(
					[
						"justify-start",
						"justify-center",
						"justify-end",
						"justify-between",
						"justify-around",
						"justify-evenly",
						"justify-stretch",
					],
					{
						enumNames: [
							"Start",
							"Center",
							"End",
							"Space between",
							"Space around",
							"Evenly distributed",
							"Stretch",
						],
						title: "Justify",
						description:
							"Justify content along the main axis (horizontal for row, vertical for column)",
						"ui:placeholder": "Not specified",
					},
				),
			),
			alignItems: optional(
				Type.Union(
					[
						Type.Literal("items-start", { title: "Start" }),
						Type.Literal("items-center", { title: "Center" }),
						Type.Literal("items-end", { title: "End" }),
						Type.Literal("items-stretch", { title: "Stretch" }),
					],
					{
						title: "Alignment",
						description:
							"Align items along the cross axis (vertical for row, horizontal for column)",
						"ui:placeholder": "Not specified",
						"ui:display": "button-group",
					},
				),
			),
		},
		{ $id: "styles:sectionLayout" },
	);
}
