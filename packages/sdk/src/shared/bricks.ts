import { Type, type Static, TypeRegistry } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { LAYOUT_COLS } from "./layout-constants";
import { defaultProps } from "./bricks/manifests/all-manifests";
import { attr } from "./attributes";
import { background } from "./bricks/props/background";
import { merge } from "lodash-es";
import def from "ajv/dist/vocabularies/discriminator";

/**
 * Generates a unique identifier for bricks.
 */
export const generateId = customAlphabet("1234567890azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN", 7);

const brickPositionSchema = Type.Object(
  {
    x: Type.Number({
      title: "X",
      description: "The column start (0-based) in grid units, not pixels.",
    }),
    y: Type.Number({
      title: "Y",
      description: "The row start (0-based) in grid units, not pixels.",
    }),
    w: Type.Number({
      title: "Width",
      description: "The width in columns in grid units, not pixels.",
    }),
    h: Type.Number({
      title: "Height",
      description: "The height in rows in grid units, not pixels.",
    }),
    manualHeight: Type.Optional(
      Type.Number({
        description: "Do not use this field. It is used internally by the editor.",
      }),
    ),
    hidden: Type.Optional(
      Type.Boolean({
        description: "Do not use this field. It is used internally by the editor.",
      }),
    ),
  },
  { $id: "brick-position" },
);

export type BrickPosition = Static<typeof brickPositionSchema>;

const definedBrickPositionSchema = Type.Object({
  x: Type.Union(
    [
      Type.Number(),
      Type.Literal("half"),
      Type.Literal("third"),
      Type.Literal("twoThird"),
      Type.Literal("quarter"),
      Type.Literal("threeQuarter"),
    ],
    {
      title: "X",
      description:
        "The column start (0-based) in grid units, not pixels. Can use aliases like 'half' to represent half of the grid.",
    },
  ),
  y: Type.Number({
    title: "Y",
    description: "The row start (0-based) in grid units, not pixels.",
  }),
  w: Type.Union(
    [
      Type.Number(),
      Type.Literal("full"),
      Type.Literal("half"),
      Type.Literal("third"),
      Type.Literal("twoThird"),
      Type.Literal("quarter"),
      Type.Literal("threeQuarter"),
    ],
    {
      title: "Width",
      description:
        "The width in columns in grid units, not pixels. Can use aliases like 'half' to represent half of the grid.",
    },
  ),
  h: Type.Union([
    Type.Number({
      title: "Height",
      description: "The height in rows in grid units, not pixels.",
    }),
  ]),
  hidden: Type.Optional(
    Type.Boolean({
      description: "Do not use this field. It is used internally by the editor.",
    }),
  ),
});

export type DefinedBrickPosition = Static<typeof definedBrickPositionSchema>;

export const brickSchema = Type.Object(
  {
    id: Type.String({
      title: "ID",
      description: "A unique identifier for the brick.",
    }),
    type: Type.String({
      title: "Type",
    }),
    props: Type.Record(Type.String(), Type.Unknown()),
    mobileProps: Type.Record(Type.String(), Type.Unknown()),
    parentId: Type.Optional(Type.String()),
    sectionId: Type.String(),
    $children: Type.Optional(Type.Array(Type.Ref("brick"))),
    position: Type.Object(
      {
        mobile: brickPositionSchema,
        desktop: brickPositionSchema,
      },
      {
        title: "Position",
        description: "The position of the brick in the layout.",
      },
    ),
  },
  { $id: "brick" },
);

export type Brick = Static<typeof brickSchema>;
export type BricksLayout = Brick[];

export const definedBrickSchema = Type.Composite([
  Type.Pick(brickSchema, ["type", "props", "sectionId", "parentId", "$children"]),
  Type.Object({
    id: Type.Optional(Type.String()),
    mobileProps: Type.Optional(brickSchema.properties.props),
    position: Type.Object({
      mobile: definedBrickPositionSchema,
      desktop: definedBrickPositionSchema,
    }),
  }),
]);

export type DefinedBrick = Static<typeof definedBrickSchema>;

const sectionProps = Type.Object(
  {
    background: Type.Optional(background()),
    width: Type.Optional(
      attr.enum("Width", "max-w-full", {
        options: [
          {
            value: "max-w-screen-lg",
            title: "Medium",
            description: "Common for text-heavy content/blog posts",
          },
          { value: "max-w-screen-xl", title: "Large", description: "Usefull or some landing pages" },
          { value: "max-w-screen-2xl", title: "Extra large", description: "Common width" },
          { value: "max-w-full", title: "Full width", description: "Takes the entire space" },
        ],
        description: "The maximum width of the page. Desktop only",
        displayAs: "select",
        "ui:group": "layout",
        "ui:group:order": 3,
        "ui:group:title": "Layout",
      }),
    ),
    $paddingHorizontal: Type.Optional(
      attr.number("Horizontal spacing", 0, {
        min: 0,
        description: "Horizontal spacing. Desktop only",
        displayAs: "button-group",
      }),
    ),
    lastTouched: Type.Optional(
      Type.Number({
        description: "Do not use this field. It is used internally by the editor.",
        "ui:field": "hidden",
      }),
    ),
  },
  { additionalProperties: true },
);

export const sectionSchema = Type.Object(
  {
    id: Type.String(),
    kind: Type.Literal("section"),
    label: Type.Optional(Type.String()),
    position: Type.Object({
      mobile: Type.Object({
        h: Type.Optional(Type.Union([Type.Number(), Type.Literal("full")])),
      }),
      desktop: Type.Object({
        h: Type.Union([Type.Number(), Type.Literal("full")]),
      }),
    }),
    order: Type.Number({
      description: "Determines section order in the page (lower numbers appear first)",
    }),
    props: sectionProps,
    mobileProps: Type.Optional(Type.Partial(sectionProps)),
  },
  { $id: "section" },
);

export type Section = Static<typeof sectionSchema>;
export type ResponsivePosition = Brick["position"];

export const definedSectionSchema = Type.Omit(sectionSchema, ["kind"]);
export type DefinedSection = Omit<Section, "kind">;

export type LayoutCols = {
  mobile: number;
  desktop: number;
};

function mapPosition(
  position: DefinedBrickPosition,
  mode: "desktop" | "mobile",
  cols: LayoutCols = LAYOUT_COLS,
): BrickPosition {
  return {
    x:
      position.x === "quarter"
        ? cols[mode] / 4
        : position.x === "threeQuarter"
          ? cols[mode] * 0.75
          : position.x === "half"
            ? cols[mode] / 2
            : position.x === "third"
              ? cols[mode] / 3
              : position.x === "twoThird"
                ? (cols[mode] * 2) / 3
                : position.x,
    y: position.y,
    w:
      position.w === "full"
        ? cols[mode]
        : position.w === "half"
          ? cols[mode] / 2
          : position.w === "third"
            ? cols[mode] / 3
            : position.w === "quarter"
              ? cols[mode] / 4
              : position.w === "twoThird"
                ? (cols[mode] * 2) / 3
                : position.w === "threeQuarter"
                  ? (cols[mode] * 3) / 4
                  : position.w,
    h: position.h,
    hidden: position.hidden,
  };
}

export function defineSections(sections: DefinedSection[]): Section[] {
  return sections.map((section) => {
    return {
      ...section,
      props: section.props ?? {},
      kind: "section",
    } as const;
  });
}

export function defineBricks<B extends DefinedBrick[] = DefinedBrick[]>(bricks: B): Brick[] {
  return bricks.map(defineBrick);
}

export function getPositionDefaults() {
  return {
    desktop: {
      w: 0,
      h: 0,
      x: 0,
      y: 0,
    },
    mobile: {
      w: 0,
      h: 0,
      x: 0,
      y: 0,
    },
  };
}

export function defineBrick(brick: DefinedBrick): Brick {
  const id = brick.id ?? `brick-${generateId()}`;
  return {
    id,
    ...brick,
    props: {
      ...merge({}, defaultProps[brick.type].props, brick.props),
      ...("$children" in brick.props
        ? {
            $children: (brick.props.$children as DefinedBrick[]).map((childBrick) => ({
              ...childBrick,
              id: childBrick.id ?? `brick-${generateId()}`,
              parentId: id,
              sectionId: brick.sectionId,
              position: { mobile: {}, desktop: {} },
              props: merge({}, defaultProps[childBrick.type].props, childBrick.props),
            })),
          }
        : {}),
    },
    mobileProps: (brick.mobileProps ?? {}) as Brick["mobileProps"],
    position: brick.position
      ? {
          mobile: mapPosition(brick.position.mobile, "mobile"),
          desktop: mapPosition(brick.position.desktop, "desktop"),
        }
      : getPositionDefaults(),
  };
}
