import { Type } from "@sinclair/typebox";
import { RxButton } from "react-icons/rx";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import { defineProps } from "../props/helpers";
import { string, urlOrPageIdRef } from "../props/string";
import type { BrickProps } from "../props/types";
import { borderRef, roundingRef } from "../props/border";
import { LAYOUT_ROW_HEIGHT } from "~/shared/layout-constants";
import { fontSize, fontSizeRef } from "../props/text";
import { colorPresetRef } from "../props/color-preset";

export const manifest = defineBrickManifest({
  type: "button",
  name: "Button",
  category: "basic",
  description: "A button with text and optional icon",
  resizable: "horizontal",
  icon: RxButton,
  // maxHeight: {
  //   desktop: LAYOUT_ROW_HEIGHT * 2,
  // },
  minWidth: {
    desktop: 120,
    mobile: 120,
  },
  defaultWidth: {
    mobile: "100%",
  },
  props: defineProps(
    {
      color: Type.Optional(
        colorPresetRef({
          "ui:solid-columns": 3,
          "ui:presets": {
            "btn-neutral-light": {
              label: "Neutral light",
              className: "bg-neutral-light text-neutral-light-content",
            },
            "btn-neutral": {
              label: "Neutral",
              className: "bg-neutral text-neutral-content",
            },
            "btn-neutral-dark": {
              label: "Neutral dark",
              className: "bg-neutral-dark text-neutral-dark-content",
            },
            "btn-primary-light": {
              label: "Primary light",
              className: "bg-primary-light text-primary-light-content",
            },
            "btn-primary": {
              label: "Primary",
              className: "bg-primary text-primary-content",
            },
            "btn-primary-dark": {
              label: "Primary dark",
              className: "bg-primary-dark text-primary-dark-content",
            },
            "btn-secondary-light": {
              label: "Secondary light",
              className: "bg-secondary-light text-secondary-light-content",
            },
            "btn-secondary": {
              label: "Secondary",
              className: "bg-secondary text-secondary-content",
            },
            "btn-secondary-dark": {
              label: "Secondary dark",
              className: "bg-secondary-dark text-secondary-dark-content",
            },
            "btn-accent-light": {
              label: "Accent light",
              className: "bg-accent-light text-accent-light-content",
            },
            "btn-accent": {
              label: "Accent",
              className: "bg-accent text-accent-content",
            },
            "btn-accent-dark": {
              label: "Accent dark",
              className: "bg-accent-dark text-accent-dark-content",
            },
            none: {
              label: "None",
              className: "",
            },
          },
          default: "btn-primary",
          title: "Color",
        }),
      ),
      label: string("Label", { default: "My button", metadata: { category: "content" } }),
      fontSize: Type.Optional(
        fontSize({
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
      linkToUrlOrPageId: Type.Optional(urlOrPageIdRef({ title: "Link", metadata: { category: "content" } })),
    },
    // { noGrow: true },
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
