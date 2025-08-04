import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import type { BrickProps } from "../props/types";
import { CgSpaceBetween } from "react-icons/cg";

export const manifest = defineBrickManifest({
  type: "spacer",
  name: "Spacer",
  category: "container",
  description: "A flexible element to create space between bricks.",
  staticClasses: "self-stretch",
  minWidth: {
    desktop: 50,
  },
  defaultWidth: {
    mobile: "auto",
    desktop: "50px",
  },
  minHeight: {
    mobile: 30,
  },
  icon: CgSpaceBetween,
  props: defineProps({}),
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
