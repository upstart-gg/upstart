import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional } from "../props/helpers";
import { image } from "../props/image";
import { backgroundColor } from "../props/background";
import { border } from "../props/border";
import { shadow } from "../props/effects";
import { padding } from "../props/padding";
import { RxImage } from "react-icons/rx";
import { string } from "../props/string";

export const manifest = defineBrickManifest({
  type: "image",
  kind: "brick",
  name: "Image",
  description: "An image brick",
  repeatable: true,
  defaultHeight: { desktop: 8, mobile: 8 },
  defaultWidth: { desktop: 3, mobile: 3 },
  icon: RxImage,
  props: defineProps({
    image: image(),
    backgroundColor: optional(backgroundColor()),
    border: optional(border()),
    padding: optional(padding()),
    shadow: optional(shadow()),
    blurHash: optional(string("Blur Hash", undefined, { "ui:fied": "hidden" })),
    credits: optional(string("Image Credits")),
  }),
});

export type Manifest = typeof manifest;
