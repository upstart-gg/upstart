import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, prop } from "../props/helpers";
import { color, textContent } from "../props/text";
import { RxButton } from "react-icons/rx";
import { StringEnum } from "~/shared/utils/schema";
import { urlOrPageId } from "../props/string";
import { Type } from "@sinclair/typebox";
import { backgroundColor } from "../props/background";
import { padding } from "../props/padding";
import { border } from "../props/border";
import { effects } from "../props/effects";
import { preset } from "../props/preset";

export const manifest = defineBrickManifest({
  type: "button",
  name: "Button",
  repeatable: true,
  description: "A button with text and optional icon",
  icon: RxButton,
  props: defineProps({
    // preset: optional(preset()),
    /*
    classnames:
  component:
  - class: 'btn'
    desc: Button
  color:
  - class: btn-neutral
    desc: neutral color
  - class: btn-primary
    desc: primary color
  - class: btn-secondary
    desc: secondary color
  - class: btn-accent
    desc: accent color
  - class: btn-info
    desc: info color
  - class: btn-success
    desc: success color
  - class: btn-warning
    desc: warning color
  - class: btn-error
    desc: error color
  style:
  - class: btn-outline
    desc: outline style
  - class: btn-dash
    desc: dash style
  - class: btn-soft
    desc: soft style
  - class: btn-ghost
    desc: ghost style
  - class: btn-link
    desc: looks like a link
  behavior:
  - class: btn-active
    desc: looks active
  - class: btn-disabled
    desc: looks disabled
  size:
  - class: btn-xs
    desc: Extra small size
  - class: btn-sm
    desc: Small size
  - class: btn-md
    desc: Medium size (default)
  - class: btn-lg
    desc: Large size
  - class: btn-xl
    desc: Extra large size
  modifier:
  - class: btn-wide
    desc: more horizontal padding
  - class: btn-block
    desc: Full width
  - class: btn-square
    desc: 1:1 ratio
  - class: btn-circle
    desc: 1:1 ratio with rounded corners
    */

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
    label: textContent("Label", "My button"),
    type: prop({
      title: "Type",
      schema: Type.Union(
        [
          Type.Literal("button", { title: "Button" }),
          Type.Literal("submit", { title: "Submit" }),
          Type.Literal("reset", { title: "Reset" }),
        ],
        {
          title: "Type",
          description: "The type of the button",
          default: "button",
        },
      ),
    }),
    linkToUrlOrPageId: optional(urlOrPageId("Link")),
  }),
});

export type Manifest = typeof manifest;
