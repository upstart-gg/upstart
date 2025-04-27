import { defineBrickManifest } from "~/shared/brick-manifest";
import { padding } from "../props/padding";
import { backgroundColor } from "../props/background";
import { defineProps, group, optional } from "../props/helpers";
import { textContent } from "../props/text";
import { BsCardText } from "react-icons/bs";
import { image } from "../props/image";

export const manifest = defineBrickManifest({
  type: "card",
  name: "Card",
  description: "A multi-purpose card that can have a title, subtitle, image, and content",
  repeatable: true,
  icon: BsCardText,
  props: defineProps({
    cardTitle: group({
      title: "Title",
      children: {
        content: textContent(),
        padding: optional(padding()),
        backgroundColor: optional(backgroundColor()),
      },
    }),
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
