import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, prop } from "../props/helpers";
import { PiConfetti } from "react-icons/pi";
import { string } from "../props/string";
import { Type } from "@sinclair/typebox";
import { backgroundColor } from "../props/background";
import { RxDividerHorizontal } from "react-icons/rx";
import type { BrickProps } from "../props/types";

export const manifest = defineBrickManifest({
  type: "divider",
  name: "Divider",
  kind: "brick",
  description: "A horizontal or vertical divider",
  repeatable: true,
  icon: RxDividerHorizontal,
  props: defineProps(
    {
      orientation: optional(
        prop({
          title: "Orientation",
          description: "Orientation of the divider",
          schema: Type.Union(
            [
              Type.Literal("horizontal", { title: "Horizontal" }),
              Type.Literal("vertical", { title: "Vertical" }),
            ],
            { default: "horizontal" },
          ),
        }),
      ),
      color: optional(backgroundColor("bg-base-300", "Divider color")),
      size: optional(
        prop({
          title: "Size",
          schema: string("Size", "100%", {
            description: "Size of the divider",
            "ai:instructions": "The size of the divider must be in % unit, like 50%",
          }),
        }),
      ),
    },
    {
      default: {
        orientation: "horizontal",
        size: "100%",
        color: "bg-base-300",
      },
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
    description: "Basic horizontal divider",
    type: "divider",
    props: {
      orientation: "horizontal",
      color: "bg-base-300",
      size: "100%",
    },
  },
  {
    description: "Accent colored divider for emphasis",
    type: "divider",
    props: {
      orientation: "horizontal",
      color: "bg-blue-500",
      size: "100%",
    },
  },
  {
    description: "Short horizontal divider for content breaks",
    type: "divider",
    props: {
      orientation: "horizontal",
      color: "bg-base-300",
      size: "50%",
    },
  },
  {
    description: "Thin vertical divider for compact layouts",
    type: "divider",
    props: {
      orientation: "vertical",
      color: "bg-gray-300",
      size: "75%",
    },
  },
  {
    description: "Bold primary colored section divider",
    type: "divider",
    props: {
      orientation: "horizontal",
      color: "bg-primary",
      size: "100%",
    },
  },
  {
    description: "Error colored divider for attention",
    type: "divider",
    props: {
      orientation: "horizontal",
      color: "bg-red-500",
      size: "100%",
    },
  },
  {
    description: "Full height vertical divider for panels",
    type: "divider",
    props: {
      orientation: "vertical",
      color: "bg-base-300",
      size: "100%",
    },
  },
  {
    description: "Secondary colored divider",
    type: "divider",
    props: {
      orientation: "horizontal",
      color: "bg-secondary",
      size: "100%",
    },
  },
];
