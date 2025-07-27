import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { backgroundRef } from "../props/background";
import { makeContainerProps } from "../props/container";
import { Type } from "@sinclair/typebox";
import { borderRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { paddingRef } from "../props/padding";
import type { BrickProps } from "../props/types";
import { cssLengthRef } from "../props/css-length";
import { directionRef } from "../props/direction";
import { RxBox } from "react-icons/rx";
import { alignItemsRef, justifyContentRef } from "../props/align";

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
    direction: directionRef({
      default: "flex-col",
      title: "Direction",
      description: "Direction of the box layout",
    }),
    justifyContent: Type.Optional(
      justifyContentRef({
        default: "justify-start",
      }),
    ),
    alignItems: Type.Optional(alignItemsRef({})),
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
    background: Type.Optional(backgroundRef()),
    border: Type.Optional(borderRef()),
    padding: Type.Optional(
      paddingRef({
        default: "p-1",
      }),
    ),
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
