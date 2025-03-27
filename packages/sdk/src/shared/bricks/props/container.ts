import { type TObject, Type, type Static } from "@sinclair/typebox";
import { getStyleProperties, getStyleValueById, group, optional, prop } from "./helpers";
import type { defaults } from "lodash-es";
import def from "ajv/dist/vocabularies/discriminator";

type FlexOptions = {
  title?: string;
  defaultValue?: {
    direction: string;
    wrap: string;
    gap: string;
    justifyContent: string;
    alignItems: string;
  };
};

export function flex(opts: FlexOptions = {}) {
  const {
    title = "Layout",
    defaultValue = {
      direction: "flex-row",
      gap: "gap-1",
      wrap: "flex-wrap",
      justifyContent: "justify-stretch",
      alignItems: "items-stretch",
    },
  } = opts;
  return prop({
    $id: "#styles:flex",
    title,
    schema: Type.Object(
      {
        direction: Type.Optional(
          Type.Union(
            [Type.Literal("flex-row", { title: "Row" }), Type.Literal("flex-col", { title: "Column" })],
            {
              title: "Direction",
              description: "The direction of the container",
            },
          ),
        ),
        gap: Type.Optional(
          Type.Union(
            [
              Type.Literal("gap-0", { title: "None" }),
              Type.Literal("gap-1", { title: "S" }),
              Type.Literal("gap-2", { title: "M" }),
              Type.Literal("gap-4", { title: "L" }),
              Type.Literal("gap-8", { title: "XL" }),
              Type.Literal("gap-16", { title: "2XL" }),
            ],
            {
              default: defaultValue,
              description: "Space between items",
              "ui:field": "enum",
            },
          ),
        ),
        wrap: Type.Optional(
          Type.Union(
            [Type.Literal("flex-wrap", { title: "Wrap" }), Type.Literal("flex-nowrap", { title: "No wrap" })],
            {
              title: "Wrap",
              description: "Wrap items",
            },
          ),
        ),
        justifyContent: Type.Optional(
          Type.Union(
            [
              Type.Literal("justify-start", { title: "Start" }),
              Type.Literal("justify-center", { title: "Center" }),
              Type.Literal("justify-end", { title: "End" }),
              Type.Literal("justify-between", { title: "Space between" }),
              Type.Literal("justify-around", { title: "Space around" }),
              Type.Literal("justify-evenly", { title: "Evenly distributed" }),
              Type.Literal("justify-stretch", { title: "Stretch" }),
            ],
            {
              title: "Justify",
              default: "justify-stretch",
            },
          ),
        ),
        alignItems: Type.Optional(
          Type.Union(
            [
              Type.Literal("items-start", { title: "Start" }),
              Type.Literal("items-center", { title: "Center" }),
              Type.Literal("items-end", { title: "End" }),
              Type.Literal("items-stretch", { title: "Stretch" }),
            ],
            {
              title: "Alignment",
              default: "items-stretch",
            },
          ),
        ),
      },
      {
        "ui:field": "flex",
        "ui:responsive": true,
        default: {
          direction: defaultValue.direction,
          gap: defaultValue.gap,
          wrap: defaultValue.wrap,
          justifyContent: defaultValue.justifyContent,
          alignItems: defaultValue.alignItems,
        },
      },
    ),
  });
}

export type FlexSettings = Static<ReturnType<typeof flex>>;

type GridOptions = {
  title?: string;
  defaultValue?: {
    gap: string;
    columns: number;
  };
};

export function grid(options: GridOptions = {}) {
  const { title = "Layout", defaultValue = { gap: "gap-1", columns: 2 } } = options;
  return prop({
    $id: "#styles:grid",
    title,
    schema: Type.Object(
      {
        columns: Type.Number({
          title: "Columns",
          description: "Number of columns",
          "ui:group": "grid",
          "ui:field": "slider",
          default: 2,
          minimum: 1,
          maximum: 12,
        }),
        gap: Type.Optional(
          Type.Union(
            [
              Type.Literal("gap-0", { title: "None" }),
              Type.Literal("gap-1", { title: "S" }),
              Type.Literal("gap-2", { title: "M" }),
              Type.Literal("gap-4", { title: "L" }),
              Type.Literal("gap-8", { title: "XL" }),
              Type.Literal("gap-16", { title: "2XL" }),
            ],
            {
              default: defaultValue,
              description: "Space between items",
              "ui:field": "enum",
            },
          ),
        ),
      },
      {
        "ui:field": "grid",
        "ui:responsive": true,
        default: defaultValue,
      },
    ),
  });
}

export type GridSettings = Static<ReturnType<typeof grid>>;

const isFlexLayoutFilter = (manifestProps: TObject, formData: Record<string, unknown>) => {
  const stylesProps = getStyleProperties(manifestProps);
  const currentStyle = getStyleValueById<ContainerLayoutSettings>(
    stylesProps,
    formData,
    "#styles:containerLayout",
  );
  return currentStyle?.type === "flex";
};

const isGridLayoutFilter = (manifestProps: TObject, formData: Record<string, unknown>) => {
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
    wrap?: string;
    justifyContent?: string;
    alignItems?: string;
  };
};

export function containerLayout({ title = "Layout", defaults = {} }: ContainerLayoutOptions = {}) {
  return group({
    title,
    options: {
      $id: "#styles:containerLayout",
    },
    children: Type.Object(
      {
        type: Type.Union([Type.Literal("flex", { title: "Flex" }), Type.Literal("grid", { title: "Grid" })], {
          title: "Layout type",
          default: defaults?.type ?? "flex",
          description:
            "Type of the container. Flex layout arranges items in a one-dimensional line. Grid layout arranges items in a two-dimensional grid.",
          "ui:field": "enum",
          "ui:responsive": true,
        }),
        gap: Type.Union(
          [
            Type.Literal("gap-0", { title: "None" }),
            Type.Literal("gap-1", { title: "Small" }),
            Type.Literal("gap-2", { title: "Medium" }),
            Type.Literal("gap-4", { title: "Large" }),
            Type.Literal("gap-8", { title: "XL" }),
            Type.Literal("gap-16", { title: "2XL" }),
          ],
          {
            title: "Gap",
            description: "Space between items",
            "ui:field": "enum",
            default: defaults?.gap ?? "gap-1",
          },
        ),
        direction: Type.Optional(
          Type.Union(
            [Type.Literal("flex-row", { title: "Row" }), Type.Literal("flex-col", { title: "Column" })],
            {
              title: "Direction",
              description: "The direction of the container",
              default: defaults?.direction ?? "flex-row",
              metadata: {
                filter: isFlexLayoutFilter,
              },
            },
          ),
        ),
        columns: optional(
          Type.Number({
            title: "Columns",
            description: "Number of columns",
            "ui:field": "slider",
            default: defaults?.columns?.default ?? 2,
            minimum: 1,
            maximum: defaults?.columns?.max ?? 12,
            metadata: {
              filter: isGridLayoutFilter,
            },
          }),
        ),
        wrap: Type.Optional(
          Type.Union(
            [Type.Literal("flex-wrap", { title: "Wrap" }), Type.Literal("flex-nowrap", { title: "No wrap" })],
            {
              title: "Wrap",
              description: "Wrap items",
              default: defaults?.wrap ?? "flex-wrap",
              metadata: {
                filter: isFlexLayoutFilter,
              },
            },
          ),
        ),
        justifyContent: Type.Optional(
          Type.Union(
            [
              Type.Literal("justify-start", { title: "Start" }),
              Type.Literal("justify-center", { title: "Center" }),
              Type.Literal("justify-end", { title: "End" }),
              Type.Literal("justify-between", { title: "Space between" }),
              Type.Literal("justify-around", { title: "Space around" }),
              Type.Literal("justify-evenly", { title: "Evenly distributed" }),
              Type.Literal("justify-stretch", { title: "Stretch" }),
            ],
            {
              title: "Justify",
              default: defaults?.justifyContent ?? "justify-stretch",
              description: "Justify content along the main axis (horizontal for row, vertical for column)",
              metadata: {
                filter: isFlexLayoutFilter,
              },
            },
          ),
        ),
        alignItems: Type.Optional(
          Type.Union(
            [
              Type.Literal("items-start", { title: "Start" }),
              Type.Literal("items-center", { title: "Center" }),
              Type.Literal("items-end", { title: "End" }),
              Type.Literal("items-stretch", { title: "Stretch" }),
            ],
            {
              title: "Alignment",
              default: defaults?.alignItems ?? "items-stretch",
              description: "Align items along the cross axis (vertical for row, horizontal for column)",
              metadata: {
                filter: isFlexLayoutFilter,
              },
            },
          ),
        ),
      },
      {
        default: {
          type: defaults?.type ?? "flex",
          gap: defaults?.gap ?? "gap-1",
          direction: defaults?.direction ?? "flex-row",
          columns: defaults?.columns?.default ?? 2,
          wrap: defaults?.wrap ?? "flex-wrap",
          justifyContent: defaults?.justifyContent ?? "justify-stretch",
          alignItems: defaults?.alignItems ?? "items-stretch",
        },
      },
    ),
  });
}

export type ContainerLayoutSettings = Static<ReturnType<typeof containerLayout>>;

export function makeContainerProps() {
  return {
    $childrenType: Type.Optional(
      Type.String({
        $id: "#container:childrenType",
        title: "Dynamic child brick type",
        description: "Type of the child bricks that will be created when container is dynamic.",
        "ui:field": "brick-type",
        metadata: {
          category: "content",
        },
      }),
    ),
    $children: Type.Array(Type.Any(), {
      $id: "#container:childrenBricks",
      "ui:field": "hidden",
      description: "List of nested bricks",
      default: [],
    }),
  };
}
