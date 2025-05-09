import { defineBrickManifest } from "~/shared/brick-manifest";
import { padding } from "../props/padding";
import { backgroundColor } from "../props/background";
import { defineProps, group, optional } from "../props/helpers";
import { textContent } from "../props/text";
import { BsCardText } from "react-icons/bs";
import { image } from "../props/image";
import { Type } from "@sinclair/typebox";

export const manifest = defineBrickManifest({
  type: "card",
  name: "Card",
  description: "A multi-purpose card that can have a title, subtitle, image, and content",
  repeatable: true,
  icon: BsCardText,
  props: defineProps({
    variants: Type.Array(
      Type.Union(
        [
          Type.Literal("image-first", { title: "Image First" }),
          Type.Literal("image-last", { title: "Image Last" }),
          Type.Literal("image-overlay", { title: "Image Overlay" }),
          Type.Literal("image-left-side", { title: "Image Left Side" }),
          Type.Literal("image-right-side", { title: "Image Right Side" }),
          Type.Literal("centered", { title: "Centered" }),
          Type.Literal("large-padding", { title: "Large padding" }),
        ],
        {
          title: "Variant",
          description:
            "The variants of the card. You can select multiple, for example: `image-first` and `centered`.",
        },
      ),
    ),
    cardTitle: optional(
      group({
        title: "Title",
        children: {
          content: textContent(),
          padding: optional(padding()),
          backgroundColor: optional(backgroundColor()),
        },
      }),
    ),
    cardImage: optional(
      group({
        title: "Image",
        children: {
          image: image(),
        },
      }),
    ),
    cardBody: optional(
      group({
        title: "Body",
        children: {
          content: textContent(),
          padding: padding(),
          backgroundColor: backgroundColor(),
        },
      }),
    ),
  }),
});

export type Manifest = typeof manifest;
