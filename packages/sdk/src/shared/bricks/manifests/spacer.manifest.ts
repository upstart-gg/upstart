import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import type { BrickProps } from "../props/types";
import { CgSpaceBetween } from "react-icons/cg";
import { boolean } from "../props/boolean";
import { Type } from "@sinclair/typebox";

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
      autogrow: Type.Optional(
        boolean("Auto-grow", false, {
          description: "If enabled, the spacer will automatically grow to fill available space.",
        }),
      ),
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
