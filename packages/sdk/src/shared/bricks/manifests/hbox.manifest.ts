import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { backgroundRef } from "../props/background";
import { makeContainerProps } from "../props/container";
import { Type } from "@sinclair/typebox";
import { borderRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { paddingRef } from "../props/padding";
import type { BrickProps } from "../props/types";
import { RxViewVertical } from "react-icons/rx";
import { cssLengthRef } from "../props/css-length";
import { StringEnum } from "~/shared/utils/string-enum";

// Generic container can hold any type of array data source
export const manifest = defineBrickManifest({
  type: "hbox",
  category: "container",
  name: "Horizontal Box",
  description: "A horizontal container for stacking bricks",
  isContainer: true,
  defaultWidth: {
    desktop: "auto",
    mobile: "100%",
  },
  defaultHeight: {
    desktop: "380px",
  },
  icon: RxViewVertical,
  props: defineProps({
    justifyContent: Type.Optional(
      StringEnum(["justify-start", "justify-center", "justify-end", "justify-stretch"], {
        enumNames: ["Top", "Center", "Bottom", "Stretch"],
        default: "justify-stretch",
        title: "Justify bricks",
        description: "Justify bricks horizontally",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:justifyContent",
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
    background: Type.Optional(backgroundRef()),
    border: Type.Optional(borderRef()),
    padding: Type.Optional(paddingRef()),
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
