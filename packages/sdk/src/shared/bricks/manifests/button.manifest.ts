import { Type } from "@sinclair/typebox";
import { RxButton } from "react-icons/rx";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import { defineProps } from "../props/helpers";
import { string, urlOrPageIdRef } from "../props/string";
import type { BrickProps } from "../props/types";
import { borderRef, roundingRef } from "../props/border";
import { LAYOUT_ROW_HEIGHT } from "~/shared/layout-constants";

export const manifest = defineBrickManifest({
  type: "button",
  name: "Button",
  repeatable: true,
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
  props: defineProps({
    color: StringEnum(["btn-color-neutral", "btn-color-primary", "btn-color-secondary", "btn-color-accent"], {
      title: "Color",
      enumNames: ["Neutral", "Primary", "Secondary", "Accent"],
      description: "Button variants.",
      default: "btn-color-primary",
      "ui:responsive": "desktop",
    }),
    label: string("Label", { default: "My button", metadata: { category: "content" } }),
    size: StringEnum(["btn-size-small", "btn-size-medium", "btn-size-large"], {
      title: "Size",
      description: "Button size.",
      enumNames: ["Small", "Medium", "Large"],
      default: "btn-size-medium",
      "ui:responsive": "desktop",
    }),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(borderRef({ default: "border-0", "ui:responsive": "desktop" })),
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
];
