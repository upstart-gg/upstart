import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional } from "../props/helpers";
import { TbCarouselHorizontal } from "react-icons/tb";
import { Type } from "@sinclair/typebox";
import { preset } from "../props/preset";

export const manifest = defineBrickManifest({
  type: "carousel",
  kind: "widget",
  name: "Carousel",
  description: "A carousel element",
  isContainer: true,
  icon: TbCarouselHorizontal,
  props: defineProps({
    variants: Type.Array(
      Type.Union(
        [
          Type.Literal("pager-arrows", { title: "With arrows pager" }),
          Type.Literal("pager-numbers", { title: "With numbered pager" }),
          Type.Literal("pager-dots", { title: "With dots pager" }),
        ],
        {
          title: "Variant",
          description: "Carousel variants.",
        },
      ),
    ),
  }),
});

export type Manifest = typeof manifest;
