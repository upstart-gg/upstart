import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, optional } from "../props/helpers";
import { background, backgroundRef } from "../props/background";
import { datasourceRef } from "../props/datasource";
import { containerLayout, containerLayoutRef, makeContainerProps } from "../props/container";
import { Type } from "@sinclair/typebox";
import { border, borderRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { padding, paddingRef } from "../props/padding";
import { RxGrid } from "react-icons/rx";
import type { BrickProps } from "../props/types";
import { LuStretchVertical, LuStretchHorizontal } from "react-icons/lu";
import { cssLengthRef } from "../props/css-length";

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
  datasource,
  icon: LuStretchHorizontal,
  props: defineProps({
    // layout: containerLayoutRef({ "ui:disable-grid": true }),
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
    background: optional(backgroundRef()),
    border: optional(borderRef()),
    padding: optional(paddingRef()),
    shadow: optional(shadowRef()),
    datasource: optional(datasourceRef()),
    ...makeContainerProps(),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [];
