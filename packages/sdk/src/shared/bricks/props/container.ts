import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

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
        direction: Type.Union(
          [Type.Literal("flex-row", { title: "Row" }), Type.Literal("flex-col", { title: "Column" })],
          {
            title: "Direction",
            description: "The direction of the container",
          },
        ),
        wrap: Type.Union(
          [Type.Literal("flex-wrap", { title: "Wrap" }), Type.Literal("flex-nowrap", { title: "No wrap" })],
          {
            title: "Wrap",
            description: "Wrap items",
          },
        ),
        gap: Type.Union(
          [
            Type.Literal("gap-0", { title: "None" }),
            Type.Literal("gap-1", { title: "S" }),
            Type.Literal("gap-2", { title: "M" }),
            Type.Literal("gap-4", { title: "L" }),
            Type.Literal("gap-8", { title: "XL" }),
            Type.Literal("gap-16", { title: "XXL" }),
          ],
          {
            title: "Gap",
            description: "Space between items",
          },
        ),
        justifyContent: Type.Union(
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
        alignItems: Type.Union(
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
        gap: Type.Union(
          [
            Type.Literal("gap-0", { title: "None" }),
            Type.Literal("gap-1", { title: "S" }),
            Type.Literal("gap-2", { title: "M" }),
            Type.Literal("gap-4", { title: "L" }),
            Type.Literal("gap-8", { title: "XL" }),
            Type.Literal("gap-16", { title: "XXL" }),
          ],
          {
            title: "Gap",
            description: "Space between items",
            "ui:field": "enum",
          },
        ),
        columns: Type.Number({
          title: "Columns",
          description: "Number of columns",
          "ui:group": "grid",
          "ui:field": "slider",
          default: 2,
          minimum: 1,
          maximum: 12,
        }),
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

export function layoutType({
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

export function makeContainerProps() {
  return {
    $childrenType: Type.Optional(
      Type.String({
        $id: "#container:childrenType",
        title: "Dynamic child brick type",
        description: "Type of the child bricks that will be created when container is dynamic.",
        "ui:field": "brick-type",
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
