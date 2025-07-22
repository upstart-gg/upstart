import { Type } from "@sinclair/typebox";
import { RxButton } from "react-icons/rx";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import { defineProps } from "../props/helpers";
import { iconRef, string, urlOrPageIdRef } from "../props/string";
import type { BrickProps } from "../props/types";
import { borderRef } from "../props/border";

export const manifest = defineBrickManifest({
  type: "button",
  name: "Button",
  repeatable: true,
  description: "A button with text and optional icon",
  icon: RxButton,
  maxHeight: {
    desktop: 50,
  },
  props: defineProps({
    color: StringEnum(["btn-color-neutral", "btn-color-primary", "btn-color-secondary", "btn-color-accent"], {
      title: "Color",
      enumNames: ["Neutral", "Primary", "Secondary", "Accent"],
      description: "Button variants.",
      default: "btn-color-primary",
    }),
    label: string("Label", { default: "My button", metadata: { category: "content" } }),
    size: StringEnum(["btn-size-small", "btn-size-medium", "btn-size-large"], {
      title: "Size",
      description: "Button size.",
      enumNames: ["Small", "Medium", "Large"],
      default: "btn-size-medium",
    }),
    border: Type.Optional(
      borderRef({
        default: {
          width: "border",
          rounding: "rounded-md",
        },
      }),
    ),
    icon: Type.Optional(
      string("Icon", {
        title: "Icon",
        description: "Icon to display (iconify reference)",
        "ui:field": "iconify",
        metadata: { category: "content" },
      }),
    ),
    linkToUrlOrPageId: Type.Optional(urlOrPageIdRef({ title: "Link", metadata: { category: "content" } })),
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
      color: "btn-color-primary",
      label: "Click me",
      linkToUrlOrPageId: "https://example.com",
      size: "btn-size-medium",
    },
  },
  {
    description: "Secondary button, block width, linking to a page",
    type: "button",
    props: {
      color: "btn-color-secondary",
      label: "Go to page",
      linkToUrlOrPageId: "page-id-123",
      size: "btn-size-small",
    },
  },
  {
    description: "Button with icon on the right",
    type: "button",
    props: {
      color: "btn-color-primary",
      label: "Icon Button",
      icon: "mdi:check-circle",
      size: "btn-size-large",
    },
  },
];
