import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, prop } from "../props/helpers";
import { PiConfetti } from "react-icons/pi";
import { string } from "../props/string";
import { Type } from "@sinclair/typebox";
import { backgroundColor } from "../props/background";
import { RxDividerHorizontal } from "react-icons/rx";

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
