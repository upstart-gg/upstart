import { defineBrickManifest } from "~/shared/brick-manifest";
import { color, textContent } from "../props/text";
import { defineProps, optional } from "../props/helpers";
import { backgroundColor } from "../props/background";
import { padding } from "../props/padding";
import { border } from "../props/border";
import { effects } from "../props/effects";
import { RxTextAlignLeft } from "react-icons/rx";

export const manifest = defineBrickManifest({
  type: "text",
  kind: "brick",
  name: "Text",
  description: "Text with formatting options",
  aiInstructions: `Text "content" can contain minimal HTML tags like <strong>, <em>, <br> and <a> as well as <p> and <span> and lists.
Only 'align' is supported as an inline style, so don't use other inline styles like 'font-size' or 'color' in the content prop.
`,
  minHeight: {
    desktop: 2,
    mobile: 2,
  },
  minWidth: {
    desktop: 2,
    mobile: 2,
  },
  defaultHeight: {
    desktop: 7,
    mobile: 7,
  },
  defaultWidth: {
    desktop: 6,
    mobile: 6,
  },
  repeatable: true,
  icon: RxTextAlignLeft,
  props: defineProps(
    {
      content: textContent(),
      backgroundColor: optional(backgroundColor()),
      color: optional(color()),
      padding: optional(padding()),
      border: optional(border()),
      effects: optional(effects({ enableTextShadow: true })),
    },
    {
      default: {
        padding: "p-8",
      },
    },
  ),
});

export type Manifest = typeof manifest;
