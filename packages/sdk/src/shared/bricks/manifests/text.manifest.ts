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
        padding: "p-2",
      },
    },
  ),
});

export type Manifest = typeof manifest;
