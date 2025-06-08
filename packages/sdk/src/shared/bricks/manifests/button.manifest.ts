import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, prop } from "../props/helpers";
import { textContent, textContentRef } from "../props/text";
import { RxButton } from "react-icons/rx";
import { string, urlOrPageId, urlOrPageIdRef } from "../props/string";
import { Type } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/schema";
import type { BrickProps } from "../props/types";

export const manifest = defineBrickManifest({
  type: "button",
  name: "Button",
  repeatable: true,
  description: "A button with text and optional icon",
  icon: RxButton,
  props: defineProps({
    /**
     * @see https://daisyui.com/components/button/?lang=en
     * @see https://raw.githubusercontent.com/saadeghi/daisyui/refs/heads/master/packages/docs/src/routes/(routes)/components/button/+page.md?plain=1
     */
    variants: Type.Array(
      Type.Union(
        [
          Type.Literal("btn-neutral", { title: "Neutral", "ai:variant-type": "color" }),
          Type.Literal("btn-primary", { title: "Primary", "ai:variant-type": "color" }),
          Type.Literal("btn-secondary", { title: "Secondary", "ai:variant-type": "color" }),
          Type.Literal("btn-accent", { title: "Accent", "ai:variant-type": "color" }),
          Type.Literal("btn-info", { title: "Info", "ai:variant-type": "color" }),
          Type.Literal("btn-success", { title: "Success", "ai:variant-type": "color" }),
          Type.Literal("btn-warning", { title: "Warning", "ai:variant-type": "color" }),
          Type.Literal("btn-error", { title: "Error", "ai:variant-type": "color" }),
          Type.Literal("btn-outline", { title: "Outline", "ai:variant-type": "style" }),
          Type.Literal("btn-dash", { title: "Dash", "ai:variant-type": "style" }),
          Type.Literal("btn-soft", { title: "Soft", "ai:variant-type": "style" }),
          Type.Literal("btn-ghost", { title: "Ghost", "ai:variant-type": "style" }),
          Type.Literal("btn-link", { title: "Link", "ai:variant-type": "style" }),
          Type.Literal("btn-active", { title: "Active", "ai:variant-type": "behavior" }),
          Type.Literal("btn-disabled", { title: "Disabled", "ai:variant-type": "behavior" }),
          Type.Literal("btn-icon-left", { title: "Icon left", "ai:variant-type": "icon" }),
          Type.Literal("btn-icon-right", { title: "Icon right", "ai:variant-type": "icon" }),
          Type.Literal("btn-xs", { title: "Extra small", "ai:variant-type": "size" }),
          Type.Literal("btn-sm", { title: "Small", "ai:variant-type": "size" }),
          Type.Literal("btn-md", { title: "Medium", "ai:variant-type": "size" }),
          Type.Literal("btn-lg", { title: "Large", "ai:variant-type": "size" }),
          Type.Literal("btn-xl", { title: "Extra large", "ai:variant-type": "size" }),
          Type.Literal("btn-wide", { title: "Wide", "ai:variant-type": "modifier" }),
          Type.Literal("btn-block", { title: "Block", "ai:variant-type": "modifier" }),
          Type.Literal("btn-square", { title: "Square", "ai:variant-type": "modifier" }),
          Type.Literal("btn-circle", { title: "Circle", "ai:variant-type": "modifier" }),
        ],
        {
          title: "Variant",
          description: "Button variants.",
          "ai:tip": "Those are DaisyUI button variants",
        },
      ),
    ),
    label: textContentRef({ title: "Label", default: "My button" }),
    type: optional(
      prop({
        title: "Type",
        schema: StringEnum(["button", "submit", "reset"], {
          enumNames: ["Button", "Submit", "Reset"],
          default: "button",
          description: "The type of the button",
          "ai:instructions":
            "Use 'button' for regular buttons, 'submit' for form submission, and 'reset' to reset form fields.",
        }),
      }),
    ),
    icon: optional(
      prop({
        title: "Icon",
        description: "Icon to display (iconify reference)",
        schema: string("Icon", undefined, {
          description: "Icon to display (iconify reference)",
          "ui:field": "iconify",
        }),
      }),
    ),
    linkToUrlOrPageId: optional(urlOrPageIdRef({ title: "Link" })),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Primary button, large size, linking to a URL",
    type: "button",
    props: {
      variants: ["btn-primary", "btn-lg"],
      label: "Click me",
      linkToUrlOrPageId: "https://example.com",
    },
  },
  {
    description: "Secondary button, small size, linking to a page",
    type: "button",
    props: {
      variants: ["btn-secondary", "btn-sm"],
      label: "Go to page",
      linkToUrlOrPageId: "page-id-123",
    },
  },
  {
    description: "Disabled button with outline style",
    type: "button",
    props: {
      variants: ["btn-outline", "btn-disabled"],
      label: "Disabled Button",
    },
  },
  {
    description: "Ghost button",
    type: "button",
    props: {
      variants: ["btn-ghost"],
      label: "Ghost Button",
      linkToUrlOrPageId: "https://example.com/ghost",
    },
  },
  {
    description: "Submit button in a form",
    type: "button",
    props: {
      variants: ["btn-primary", "btn-md"],
      label: "Submit form",
      type: "submit",
    },
  },
  {
    description: "Button with icon on the right",
    type: "button",
    props: {
      variants: ["btn-primary", "btn-md", "btn-icon-right"],
      label: "Icon Button",
      icon: "mdi:check-circle",
    },
  },
];
