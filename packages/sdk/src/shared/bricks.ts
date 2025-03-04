import { Type, type Static } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { LAYOUT_COLS } from "./layout-constants";
import type { ResponsiveMode } from "./responsive";
import { manifest as buttonManifest } from "./bricks/manifests/button.manifest";
import { manifest as cardManifest } from "./bricks/manifests/card.manifest";
import { manifest as carouselManifest } from "./bricks/manifests/carousel.manifest";
import { manifest as countdownManifest } from "./bricks/manifests/countdown.manifest";
import { manifest as footerManifest } from "./bricks/manifests/footer.manifest";
import { manifest as formManifest } from "./bricks/manifests/form.manifest";
import { manifest as headerManifest } from "./bricks/manifests/header.manifest";
import { manifest as heroManifest } from "./bricks/manifests/hero.manifest";
import { manifest as iconManifest } from "./bricks/manifests/icon.manifest";
import { manifest as imageManifest } from "./bricks/manifests/image.manifest";
import { manifest as imagesWallManifest } from "./bricks/manifests/images-wall.manifest";
import { manifest as mapManifest } from "./bricks/manifests/map.manifest";
import { manifest as socialLinksManifest } from "./bricks/manifests/social-links.manifest";
import { manifest as textManifest } from "./bricks/manifests/text.manifest";
import { manifest as videoManifest } from "./bricks/manifests/video.manifest";
import { manifest as loopManifest } from "./bricks/manifests/loop.manifest";
import { manifest as containerManifest } from "./bricks/manifests/container.manifest";
import { manifest as genericComponentManifest } from "./bricks/manifests/generic-component.manifest";
import { defaults } from "./bricks/manifests/all-manifests";
/**
 * Generates a unique identifier for bricks.
 */
export const generateId = customAlphabet("1234567890azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN", 7);

const brickPositionSchema = Type.Object({
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
});

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
  h: Type.Number({
    title: "Height",
    description: "The height in rows in grid units, not pixels.",
  }),
  hidden: Type.Optional(
    Type.Boolean({
      description: "Do not use this field. It is used internally by the editor.",
    }),
  ),
});

export type DefinedBrickPosition = Static<typeof definedBrickPositionSchema>;

export const brickSchema = Type.Composite([
  Type.Union([
    Type.Object({
      type: Type.Literal("button"),
      props: buttonManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(buttonManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("card"),
      props: cardManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(cardManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("carousel"),
      props: carouselManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(carouselManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("countdown"),
      props: countdownManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(countdownManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("footer"),
      props: footerManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(footerManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("form"),
      props: formManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(formManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("header"),
      props: headerManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(headerManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("hero"),
      props: heroManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(heroManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("icon"),
      props: iconManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(iconManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("image"),
      props: imageManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(imageManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("images-wall"),
      props: imagesWallManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(imagesWallManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("map"),
      props: mapManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(mapManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("social-links"),
      props: socialLinksManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(socialLinksManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("text"),
      props: textManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(textManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("video"),
      props: videoManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(videoManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("html-element"),
      props: Type.Record(Type.String(), Type.Any()),
      mobileOverride: Type.Optional(Type.Record(Type.String(), Type.Any())),
    }),
    Type.Object({
      type: Type.Literal("generic-component"),
      props: genericComponentManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(genericComponentManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("loop"),
      props: loopManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(loopManifest.properties.props)),
    }),
    Type.Object({
      type: Type.Literal("container"),
      props: containerManifest.properties.props,
      mobileOverride: Type.Optional(Type.Partial(containerManifest.properties.props)),
    }),
  ]),
  Type.Object({
    id: Type.String({
      title: "ID",
      description: "A unique identifier for the brick.",
    }),
    isContainer: Type.Optional(Type.Boolean({ default: false })),
    parentId: Type.Optional(Type.String()),
    hideInLibrary: Type.Optional(Type.Boolean()),
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
  }),
]);

export type Brick = Static<typeof brickSchema>;
export type BricksLayout = Brick[];
export type Section = { id: string; label?: string; bricks: BricksLayout };
export type ResponsivePosition = Brick["position"];

const definedBrickSchema = Type.Composite([
  Type.Omit(brickSchema, ["id", "position", "manifest"]),
  Type.Object({
    position: Type.Object({
      mobile: definedBrickPositionSchema,
      desktop: definedBrickPositionSchema,
    }),
  }),
]);

export type DefinedBrick = Static<typeof definedBrickSchema>;

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

export function defineBricks<B extends DefinedBrick[]>(bricks: B): Brick[] {
  return bricks.map((brick) => {
    const id = `brick-${generateId()}`;
    return {
      id,
      ...defaults[brick.type],
      ...brick,
      props: {
        ...brick.props,
        ...("childrenBricks" in brick.props
          ? {
              childrenBricks: (brick.props.childrenBricks as DefinedBrick[]).map((childBrick) => ({
                id: `brick-${generateId()}`,
                ...defaults[childBrick.type],
                ...childBrick,
                parentId: id,
                ...("position" in childBrick
                  ? {}
                  : {
                      position: {
                        mobile: {},
                        desktop: {},
                      },
                    }),
              })),
            }
          : {}),
      },
      position: {
        mobile: mapPosition(brick.position.mobile, "mobile"),
        desktop: mapPosition(brick.position.desktop, "desktop"),
      },
    };
  });
}

/**
 * This specific type is used to define a row of bricks.
 * The `y` property of the position is automatically set to the current row.
 */
type DefinedRowBrick = Omit<Brick, "id" | "manifest" | "position"> & {
  // manifest?: BrickManifest;
  position: {
    mobile?: Omit<DefinedBrickPosition, "y"> & { forceY?: number };
    desktop: Omit<DefinedBrickPosition, "y"> & { forceY?: number };
  };
};

// Helpers to generate bricks coordonates
const currentRowByBreakpoint: Record<ResponsiveMode, number> = {
  mobile: 0,
  desktop: 0,
};

/**
 * Creates a new row of bricks, automatically setting the `y` property to the current row.
 */
export function createRow<B extends DefinedRowBrick[]>(
  bricks: B,
  initialY = { desktop: 0, mobile: 0 },
): DefinedBrick[] {
  // create the row
  const created = bricks.map((brick, index) => {
    const adjusted = {
      ...brick,
      position: {
        desktop: {
          ...brick.position.desktop,
          y: brick.position.desktop.forceY ?? currentRowByBreakpoint.desktop,
        },
        ...(brick.position.mobile
          ? {
              mobile: {
                ...brick.position.mobile,
                y: brick.position.mobile.forceY ?? currentRowByBreakpoint.mobile,
              },
            }
          : null),
      },
    };

    if (adjusted.position.mobile?.w === LAYOUT_COLS.mobile && index !== bricks.length - 1) {
      currentRowByBreakpoint.mobile += adjusted.position.mobile.h;
    }

    return adjusted;
  });

  // Get the max height of the bricks passed
  const maxDesktopHeight = Math.max(...bricks.map((brick) => brick.position.desktop?.h ?? initialY.desktop));
  const maxMobileHeight = Math.max(...bricks.map((brick) => brick.position.mobile?.h ?? initialY.mobile));

  // increment the current row
  currentRowByBreakpoint.desktop += maxDesktopHeight;
  currentRowByBreakpoint.mobile += maxMobileHeight;

  // return the created bricks
  return created as DefinedBrick[];
}
