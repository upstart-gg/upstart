import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { RxButton } from "react-icons/rx";
import { string, urlOrPageIdRef } from "../props/string";
import { Type } from "@sinclair/typebox";
import type { BrickProps } from "../props/types";
import { StringEnum } from "~/shared/utils/string-enum";

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
          Type.Literal("btn-neutral", { title: "Neutral", "ui:variant-type": "color" }),
          Type.Literal("btn-primary", { title: "Primary", "ui:variant-type": "color" }),
          Type.Literal("btn-secondary", { title: "Secondary", "ui:variant-type": "color" }),
          Type.Literal("btn-accent", { title: "Accent", "ui:variant-type": "color" }),
          Type.Literal("btn-info", { title: "Info", "ui:variant-type": "color" }),
          Type.Literal("btn-success", { title: "Success", "ui:variant-type": "color" }),
          Type.Literal("btn-warning", { title: "Warning", "ui:variant-type": "color" }),
          Type.Literal("btn-error", { title: "Error", "ui:variant-type": "color" }),
          Type.Literal("btn-outline", { title: "Outline", "ui:variant-type": "style" }),
          Type.Literal("btn-dash", { title: "Dash", "ui:variant-type": "style" }),
          Type.Literal("btn-soft", { title: "Soft", "ui:variant-type": "style" }),
          Type.Literal("btn-ghost", { title: "Ghost", "ui:variant-type": "style" }),
          Type.Literal("btn-link", { title: "Link", "ui:variant-type": "style" }),
          Type.Literal("btn-active", { title: "Active", "ui:variant-type": "behavior" }),
          Type.Literal("btn-disabled", { title: "Disabled", "ui:variant-type": "behavior" }),
          Type.Literal("btn-icon-left", { title: "Icon left", "ui:variant-type": "icon" }),
          Type.Literal("btn-icon-right", { title: "Icon right", "ui:variant-type": "icon" }),
          Type.Literal("btn-xs", { title: "Extra small", "ui:variant-type": "size" }),
          Type.Literal("btn-sm", { title: "Small", "ui:variant-type": "size" }),
          Type.Literal("btn-md", { title: "Medium", "ui:variant-type": "size" }),
          Type.Literal("btn-lg", { title: "Large", "ui:variant-type": "size" }),
          Type.Literal("btn-xl", { title: "Extra large", "ui:variant-type": "size" }),
          Type.Literal("btn-wide", { title: "Wide", "ui:variant-type": "modifier" }),
          Type.Literal("btn-block", { title: "Block", "ui:variant-type": "modifier" }),
          Type.Literal("btn-square", { title: "Square", "ui:variant-type": "modifier" }),
          Type.Literal("btn-circle", { title: "Circle", "ui:variant-type": "modifier" }),
        ],
        {
          title: "Variant",
          description: "Button variants.",
          "ai:tip": "Those are DaisyUI button variants",
        },
      ),
    ),
    label: string("Label", { default: "My button" }),
    justifyContent: Type.Optional(
      StringEnum(["justify-start", "justify-center", "justify-end"], {
        enumNames: ["Left", "Center", "Right"],
        title: "Alignment",
        "ui:placeholder": "Not specified",
        default: "justify-center",
        "ui:responsive": "desktop",
      }),
    ),
    type: Type.Optional(
      StringEnum(["button", "submit", "reset"], {
        title: "Type",
        enumNames: ["Button", "Submit", "Reset"],
        default: "button",
        description: "The type of the button",
        "ai:instructions":
          "Use 'button' for regular buttons, 'submit' for form submission, and 'reset' to reset form fields.",
      }),
    ),
    icon: Type.Optional(
      string("Icon", {
        title: "Icon",
        description: "Icon to display (iconify reference)",
        "ui:field": "iconify",
      }),
    ),
    linkToUrlOrPageId: Type.Optional(urlOrPageIdRef({ title: "Link" })),
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
