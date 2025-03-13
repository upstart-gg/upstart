import { Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { padding } from "../props/padding";
import { backgroundColor } from "../props/background";
import { defineProps, group } from "../props/helpers";
import { textContent } from "../props/text";

export const manifest = defineBrickManifest({
  type: "card",
  name: "Card",
  description: "A multi-purpose card that can have a title, subtitle, image, and content",
  repeatable: true,
  // svg icon for the "card" brick
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="11" x2="21" y2="11"></line><line x1="7" y1="14" x2="17" y2="14"></line>
        <line x1="7" y1="17" x2="15" y2="17"></line></svg>`,

  props: defineProps({
    cardTitle: group({
      title: "Title",
      children: {
        content: textContent(),
        padding: padding(),
        backgroundColor: backgroundColor(),
      },
    }),
    cardImage: group({
      title: "Image",
      children: {
        image: textContent(),
      },
    }),
    cardBody: group({
      title: "Body",
      children: {
        content: textContent(),
        padding: padding(),
        backgroundColor: backgroundColor(),
      },
    }),
  }),
});

export type Manifest = typeof manifest;
