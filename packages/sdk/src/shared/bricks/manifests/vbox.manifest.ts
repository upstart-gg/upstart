import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { backgroundRef } from "../props/background";
import { datasourceRef } from "../props/datasource";
import { makeContainerProps } from "../props/container";
import { Type } from "@sinclair/typebox";
import { borderRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { paddingRef } from "../props/padding";
import type { BrickProps } from "../props/types";
import { LuStretchHorizontal } from "react-icons/lu";
import { cssLengthRef } from "../props/css-length";
import { StringEnum } from "~/shared/utils/string-enum";

export const datasource = Type.Array(Type.Object({}, { additionalProperties: true }));

// Generic container can hold any type of array data source
export const manifest = defineBrickManifest({
  type: "vbox",
  kind: "widget",
  name: "Vertical box",
  description: "A vertical container for stacking bricks",
  isContainer: true,
  defaultWidth: {
    desktop: "auto",
    mobile: "100%",
  },
  defaultHeight: {
    desktop: "380px",
  },
  datasource,
  icon: LuStretchHorizontal,
  props: defineProps({
    alignItems: Type.Optional(
      StringEnum(["items-start", "items-center", "items-end", "items-stretch"], {
        enumNames: ["Top", "Center", "Bottom", "Stretch"],
        default: "items-stretch",
        title: "Align bricks",
        description: "Align bricks vertically",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:alignItems",
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
    // datasource: Type.Optional(datasourceRef()),
    ...makeContainerProps(),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [];
