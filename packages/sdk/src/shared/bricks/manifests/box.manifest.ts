import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { backgroundColorRef } from "../props/background";
import { makeContainerProps } from "../props/container";
import { type Static, type TObject, Type } from "@sinclair/typebox";
import { borderRef, roundingRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { paddingRef } from "../props/padding";
import type { BrickProps } from "../props/types";
import { cssLengthRef } from "../props/css-length";
import { directionRef } from "../props/direction";
import { RxBox } from "react-icons/rx";
import { alignItemsRef, justifyContentRef } from "../props/align";
import { StringEnum } from "~/shared/utils/string-enum";
import { colorPresetRef } from "../props/color-preset";

// Generic container can hold any type of array data source
export const manifest = defineBrickManifest({
  type: "box",
  category: "container",
  name: "Box",
  description: "A box for stacking bricks horizontally or vertically",
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
    color: Type.Optional(
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
        default: "items-center",
      }),
    ),
    gap: Type.Optional(
      cssLengthRef({
        title: "Gap",
        default: "10px",
        description: "Space between bricks.",
        "ai:instructions":
          "Can be a tailwind gap class like 'gap-1' or 'gap-2', or a custom value like '10px'",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:gap",
      }),
    ),
    padding: Type.Optional(
      paddingRef({
        default: "p-2",
      }),
    ),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(borderRef()),
    shadow: Type.Optional(shadowRef()),
    ...makeContainerProps(),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [];
