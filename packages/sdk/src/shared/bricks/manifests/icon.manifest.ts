import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, prop } from "../props/helpers";
import { PiConfetti } from "react-icons/pi";
import { string } from "../props/string";

export const manifest = defineBrickManifest({
  type: "icon",
  name: "Icon",
  kind: "brick",
  description: "An icon with optional text",
  repeatable: true,
  icon: PiConfetti,
  props: defineProps({
    icon: prop({
      title: "Icon",
      description: "Icon to display (iconify reference)",
      schema: string("Icon", undefined, {
        description: "Icon to display (iconify reference)",
        "ui:widget": "iconify",
      }),
    }),
    size: prop({
      title: "Size",
      description: "Size of the icon",
      schema: string("Size", "1em", {
        description: "Size of the icon",
        "ai:instructions": "The size of the icon can be set using 'em' or '%' unit.",
      }),
    }),
  }),
});

export type Manifest = typeof manifest;
