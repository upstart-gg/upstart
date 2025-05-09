import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, optional } from "../props/helpers";
import { basicAlign } from "../props/align";
import { background } from "../props/background";
import { border } from "../props/border";
import { color, textContent } from "../props/text";
import { padding } from "../props/padding";
import { BsAlphabetUppercase } from "react-icons/bs";
import { effects } from "../props/effects";
import { preset } from "../props/preset";

export const manifest = defineBrickManifest({
  type: "hero",
  name: "Hero",
  kind: "brick",
  description: "A big textual element for home pages",
  aiInstructions: `
      This hero element is a large text element that can be used to display a title and an optional tagline.
      It is typically used on home pages to grab the user's attention.
  `.trim(),
  icon: BsAlphabetUppercase,

  defaultHeight: { desktop: 5, mobile: 5 },
  defaultWidth: { desktop: 12, mobile: 12 },

  props: defineProps(
    {
      content: textContent("Hero title", "I'm a big text"),
      tagline: optional(textContent("Hero tagline", "I'm a tagline")),
      background: optional(background()),
      color: optional(color()),
      effects: optional(effects({ enableTextShadow: true })),
      align: optional(basicAlign()),
      padding: optional(padding("p-4")),
      border: optional(border()),
    },
    {
      default: {
        padding: "p-4",
        color: "color-auto",
      },
    },
  ),
});

export type Manifest = typeof manifest;
