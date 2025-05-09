import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional } from "../props/helpers";
import { image } from "../props/image";
import { backgroundColor } from "../props/background";
import { border } from "../props/border";
import { shadow } from "../props/effects";
import { padding } from "../props/padding";
import { RxImage } from "react-icons/rx";
import { string } from "../props/string";
import { str } from "ajv";
import { Type } from "@sinclair/typebox";

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
    blurHash: optional(
      string("Blur Hash", undefined, {
        "ui:fied": "hidden",
        description: "A placeholder for the image while it is loading. Use a blur hash string.",
      }),
    ),
    author: optional(
      Type.Object({
        name: string("Image Author", undefined, {
          "ui:field": "hidden",
          description: "Image author. Use this to give credit to the author of the image.",
        }),
        url: string("Image Author URL", undefined, {
          "ui:field": "hidden",
          description: "Image author URL. Use this to give credit to the author of the image.",
        }),
      }),
    ),
    provider: optional(
      string("Image Provider", undefined, {
        "ui:field": "hidden",
        description: "Image provider. Use this to give credit to the author of the image.",
      }),
    ),
  }),
});

export type Manifest = typeof manifest;
