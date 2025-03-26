import { type TObject, Type, type Static } from "@sinclair/typebox";
import { getStyleProperties, getStyleValueById, group, optional, prop } from "./helpers";

type GapOptions = {
  title?: string;
};

export function gap(defaultValue = "gap-1", { title = "Gap" }: GapOptions = {}) {
  return prop({
    $id: "#styles:gap",
    title,
    schema: Type.Union(
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
  });
}

export type GapSettings = Static<ReturnType<typeof gap>>;

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

type LayoutTypeOptions = {
  defaultValue?: "flex" | "grid";
  title?: string;
  description?: string;
};

function layoutType({
  defaultValue = "flex",
  title = "Layout type",
  description = "Type of the container. Flex layout arranges items in a one-dimensional line. Grid layout arranges items in a two-dimensional grid.",
}: LayoutTypeOptions = {}) {
  return prop({
    $id: "#styles:layoutType",
    title,
    schema: Type.Union([Type.Literal("flex", { title: "Flex" }), Type.Literal("grid", { title: "Grid" })], {
      description,
      default: defaultValue,
      "ui:field": "enum",
      "ui:responsive": true,
    }),
  });
}

export type LayoutTypeSettings = Static<ReturnType<typeof layoutType>>;

const isFlexLayoutFilter = (manifestProps: TObject, formData: Record<string, unknown>) => {
  const stylesProps = getStyleProperties(manifestProps);
  const currentStyle = getStyleValueById<ContainerLayoutSettings>(
    stylesProps,
    formData,
    "#styles:container-layout",
  );
  return currentStyle?.type === "flex";
};

const isGridLayoutFilter = (manifestProps: TObject, formData: Record<string, unknown>) => {
  return !isFlexLayoutFilter(manifestProps, formData);
};

export function containerLayout() {
  return group({
    title: "Layout",
    options: {
      $id: "#styles:container-layout",
      "ui:field": "container-layout",
    },
    children: Type.Object(
      {
        type: Type.Union([Type.Literal("flex", { title: "Flex" }), Type.Literal("grid", { title: "Grid" })], {
          title: "Layout type",
          default: "flex",
          description:
            "Type of the container. Flex layout arranges items in a one-dimensional line. Grid layout arranges items in a two-dimensional grid.",
          "ui:field": "enum",
          "ui:responsive": true,
        }),
        gap: optional(gap("gap-2")),
        direction: Type.Optional(
          Type.Union(
            [Type.Literal("flex-row", { title: "Row" }), Type.Literal("flex-col", { title: "Column" })],
            {
              title: "Direction",
              description: "The direction of the container",
              default: "flex-row",
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
            "ui:group": "grid",
            "ui:field": "slider",
            default: 2,
            minimum: 1,
            maximum: 12,
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
              default: "flex-wrap",
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
              default: "justify-stretch",
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
              default: "items-stretch",
              description: "Align items along the cross axis (vertical for row, horizontal for column)",
              metadata: {
                filter: isFlexLayoutFilter,
              },
            },
          ),
        ),
      },
      {
        "ui:field": "container-layout",
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
