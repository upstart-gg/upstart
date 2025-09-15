import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { Type } from "@sinclair/typebox";
import { borderRef, roundingRef } from "../props/border";
import { shadowRef } from "../props/effects";
import type { BrickProps } from "../props/types";
import { cssLengthRef } from "../props/css-length";
import { directionRef } from "../props/direction";
import { RxBox } from "react-icons/rx";
import { alignItemsRef, justifyContentRef } from "../props/align";
import { colorPresetRef } from "../props/color-preset";
import { loopRef } from "../props/dynamic";

// Generic container can hold any type of array data source
export const manifest = defineBrickManifest({
  type: "box",
  category: "container",
  name: "Box",
  description: "A box for stacking bricks horizontally or vertically.",
  aiInstructions: "This is the only brick type that can contain other bricks.",
  isContainer: true,
  defaultWidth: {
    desktop: "auto",
    mobile: "100%",
  },
  defaultHeight: {
    desktop: "auto",
  },
  icon: RxBox,
  props: defineProps({
    colorPreset: Type.Optional(
      colorPresetRef({
        title: "Color",
      }),
    ),
    direction: directionRef({
      default: "flex-col",
      title: "Direction",
      description: "Direction of the box layout",
    }),
    justifyContent: Type.Optional(
      justifyContentRef({
        default: "justify-center",
      }),
    ),
    alignItems: Type.Optional(
      alignItemsRef({
        default: "items-stretch",
      }),
    ),
    gap: Type.Optional(
      cssLengthRef({
        title: "Gap",
        default: "1rem",
        description: "Gap between children bricks.",
        "ai:instructions":
          "Can be a tailwind gap class like 'gap-1' or 'gap-2', or a custom value like '10px'",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:gap",
      }),
    ),
    padding: Type.Optional(
      cssLengthRef({
        default: "1rem",
        description: "Padding inside the box.",
        "ai:instructions": "Use only a single value like '1rem' or '10px'",
        title: "Padding",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(borderRef()),
    shadow: Type.Optional(shadowRef()),
    loop: Type.Optional(loopRef()),
    $children: Type.Array(Type.Any(), {
      "ui:field": "hidden",
      description: "List of nested bricks",
      default: [],
      examples: [
        [
          {
            type: "text",
            props: {
              content: "Hello World",
            },
          },
          {
            type: "image",
            props: {
              src: "https://via.placeholder.com/150",
              alt: "Placeholder Image",
            },
          },
        ],
      ],
    }),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "A simple box with 2 text bricks aligned vertically",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1rem",
      $children: [
        {
          type: "text",
          props: {
            $children: [
              {
                type: "text",
                props: {
                  content: "Hello World",
                },
              },
              {
                type: "text",
                props: {
                  content: "Hello World",
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    description: "A horizontal box with 3 images",
    type: "box",
    props: {
      direction: "flex-row",
      gap: "1rem",
      $children: [
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Placeholder Image",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Placeholder Image",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Placeholder Image",
          },
        },
      ],
    },
  },
  {
    description: "A vertical box with 2 text bricks and 1 image",
    type: "box",
    props: {
      direction: "flex-col",
      gap: "1rem",
      $children: [
        {
          type: "text",
          props: {
            content: "Hello World",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/150",
            alt: "Placeholder Image",
          },
        },
        {
          type: "text",
          props: {
            content: "Hello World",
          },
        },
      ],
    },
  },
];
