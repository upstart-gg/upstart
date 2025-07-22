import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { backgroundRef } from "../props/background";
import { makeContainerProps } from "../props/container";
import { Type } from "@sinclair/typebox";
import { borderRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { paddingRef } from "../props/padding";
import type { BrickProps } from "../props/types";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";

// Generic container can hold any type of array data source
export const manifest = defineBrickManifest({
  type: "box",
  kind: "brick",
  name: "Box",
  description: "A container for a single brick to give it a background, border, padding, etc.",
  isContainer: true,
  defaultWidth: {
    desktop: "auto",
    mobile: "100%",
  },
  defaultHeight: {
    desktop: "380px",
  },
  icon: MdOutlineCheckBoxOutlineBlank,
  props: defineProps({
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
