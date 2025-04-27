import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { TbCarouselHorizontal } from "react-icons/tb";

export const manifest = defineBrickManifest({
  type: "carousel",
  kind: "widget",
  name: "Carousel",
  description: "A carousel element",
  isContainer: true,
  icon: TbCarouselHorizontal,
  props: defineProps({}),
});

export type Manifest = typeof manifest;
