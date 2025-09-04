import { Type } from "@sinclair/typebox";
import { RxButton } from "react-icons/rx";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { string, urlOrPageIdRef } from "../props/string";
import type { BrickProps } from "../props/types";
import { borderRef, roundingRef } from "../props/border";
import { fontSizeRef } from "../props/text";
import { colorPresetRef } from "../props/color-preset";

export const manifest = defineBrickManifest({
  type: "button",
  name: "Button",
  category: "basic",
  description: "A button",
  resizable: "horizontal",
  icon: RxButton,
  minWidth: {
    desktop: 120,
    mobile: 120,
  },
  defaultWidth: {
    mobile: "100%",
  },
  props: defineProps({
    colorPreset: Type.Optional(
      colorPresetRef({
        default: { color: "primary-500" },
        title: "Color",
        "ui:default-gradient-direction": "bg-gradient-to-b",
      }),
    ),
    label: string("Label", { default: "My button", metadata: { category: "content" } }),
    fontSize: Type.Optional(
      fontSizeRef({
        title: "Font Size",
        description: "The font size of the button text.",
        default: "text-base",
        "ui:responsive": "desktop",
        "ui:no-extra-large-sizes": true,
      }),
    ),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(borderRef({ default: { width: "border-0" }, "ui:responsive": "desktop" })),
    linkToUrlOrPageId: Type.Optional(
      urlOrPageIdRef({
        title: "Link",
        "ui:placeholder": "https://example.com",
        metadata: { category: "content" },
      }),
    ),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Primary button, full width, linking to a URL",
    type: "button",
    props: {
      label: "Click me",
      linkToUrlOrPageId: "https://example.com",
    },
  },
  {
    description: "Secondary button, block width, linking to a page",
    type: "button",
    props: {
      label: "Go to page",
      linkToUrlOrPageId: "page-id-123",
    },
  },
];
