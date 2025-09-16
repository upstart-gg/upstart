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
  aiInstructions:
    "A clickable button that can link to a URL or a page within the site. It can be styled with different colors, font sizes, and border radii. Don't use it in forms since forms have their own submit button.",
  resizable: "horizontal",
  icon: RxButton,
  minWidth: {
    desktop: 120,
    mobile: 120,
  },
  defaultWidth: {
    mobile: "100%",
  },
  props: defineProps(
    {
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
          title: "Font size",
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
      link: Type.Optional(
        urlOrPageIdRef({
          title: "Link",
          "ui:placeholder": "https://example.com",
          metadata: { category: "content" },
        }),
      ),
    },
    { noGrow: true },
  ),
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
      link: "https://example.com",
      colorPreset: { color: "primary-500" },
    },
  },
  {
    description: "Secondary button, block width, linking to a page",
    type: "button",
    props: {
      label: "Go to page",
      link: "page-id-123",
      colorPreset: { color: "secondary-500" },
    },
  },
  {
    description: "Neutral colored button with large text and rounded corners",
    type: "button",
    props: {
      label: "Submit",
      fontSize: "text-lg",
      rounding: "rounded-full",
      colorPreset: { color: "neutral-500" },
    },
  },
];
