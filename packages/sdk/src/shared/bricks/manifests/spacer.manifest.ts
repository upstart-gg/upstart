import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional } from "../props/helpers";
import { backgroundColorRef } from "../props/background";
import type { BrickProps } from "../props/types";
import { CgSpaceBetween } from "react-icons/cg";

export const manifest = defineBrickManifest({
  type: "spacer",
  name: "Spacer",
  kind: "brick",
  description: "A flexible element to create space between bricks.",
  repeatable: true,
  minWidth: {
    desktop: 50,
    mobile: 20,
  },
  defaultWidth: {
    mobile: "100%",
    desktop: "50px",
  },
  minHeight: {
    mobile: 30,
  },
  icon: CgSpaceBetween,
  props: defineProps(
    {
      color: optional(backgroundColorRef({ default: "bg-transparent", title: "Divider color" })),
    },
    {
      noPreset: true,
    },
  ),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Transparent spacer of 100px wide",
    type: "spacer",
    props: {
      width: "100px",
    },
  },
  {
    description: "Transparent spacer of 20px wide",
    type: "spacer",
    props: {
      width: "20px",
    },
  },
];
