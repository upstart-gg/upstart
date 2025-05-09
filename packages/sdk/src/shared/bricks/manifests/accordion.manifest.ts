import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, group, prop } from "../props/helpers";
import { Type } from "@sinclair/typebox";
import { MdExpandMore } from "react-icons/md";
import { preset } from "../props/preset";
import { backgroundColor } from "../props/background";
import { textContent } from "../props/text";
import { string } from "../props/string";
import { padding } from "../props/padding";
import { border } from "../props/border";
import { shadow } from "../props/effects";
import { boolean } from "../props/boolean";

export const manifest = defineBrickManifest({
  type: "accordion",
  kind: "widget",
  name: "Accordion",
  description: "An accordion/collapse element for expandable content",
  aiInstructions: `
    This accordion element displays content in collapsible panels.
    It is typically used for FAQ sections, organized documentation, or to save space.
    Each item has a title and expandable content area.
    Multiple panels can be open simultaneously or limited to one at a time.
  `.trim(),
  icon: MdExpandMore,

  defaultHeight: { desktop: 10, mobile: 15 },
  defaultWidth: { desktop: 36, mobile: 24 },

  props: defineProps(
    {
      preset: optional(preset()),
      container: optional(
        group({
          title: "Container",
          children: {
            backgroundColor: optional(backgroundColor()),
            padding: optional(padding("p-4")),
            border: optional(border()),
            shadow: optional(shadow()),
          },
        }),
      ),
      items: prop({
        title: "Accordion items",
        schema: Type.Array(
          Type.Object({
            title: textContent("Title", "Section title", { disableSizing: true }),
            content: textContent("Content", "Expandable content goes here"),
            defaultOpen: optional(boolean("Open by default", false)),
            icon: optional(
              prop({
                title: "Icon",
                description: "Icon to display (iconify reference)",
                schema: string("Icon", undefined, {
                  description: "Icon for this accordion item",
                  "ui:widget": "iconify",
                }),
              }),
            ),
            disabled: optional(boolean("Disabled", false)),
          }),
        ),
      }),
      behavior: optional(
        group({
          title: "Behavior",
          children: {
            allowMultiple: optional(
              boolean("Allow multiple open", true, {
                description: "Allow multiple accordion items to be open at the same time",
              }),
            ),
            collapsible: optional(
              boolean("Collapsible", true, {
                description: "Allow opened items to be collapsed",
              }),
            ),
            animation: optional(
              prop({
                title: "Animation",
                schema: Type.Union(
                  [
                    Type.Literal("none", { title: "None" }),
                    Type.Literal("slide", { title: "Slide" }),
                    Type.Literal("fade", { title: "Fade" }),
                  ],
                  { default: "slide" },
                ),
              }),
            ),
          },
        }),
      ),
      variants: Type.Array(
        Type.Union(
          [
            Type.Literal("bordered", {
              title: "Bordered",
              description: "Add borders around accordion items",
            }),
            Type.Literal("separated", {
              title: "Separated",
              description: "Add space between accordion items",
            }),
            Type.Literal("minimal", {
              title: "Minimal",
              description: "Simple design with minimal styling",
            }),
            Type.Literal("card-style", {
              title: "Card style",
              description: "Display each item as a card",
            }),
            Type.Literal("with-icon", {
              title: "With icon",
              description: "Show expand/collapse icon",
            }),
            Type.Literal("icon-left", {
              title: "Icon left",
              description: "Position expand icon on the left",
            }),
            Type.Literal("flush", {
              title: "Flush",
              description: "Remove outer borders and padding",
            }),
          ],
          {
            title: "Variant",
            description: "Accordion display variants",
          },
        ),
        { default: ["bordered", "with-icon"] },
      ),
    },
    {
      default: {
        container: {
          padding: "p-6",
          backgroundColor: "bg-transparent",
        },
        behavior: {
          allowMultiple: true,
          collapsible: true,
          animation: "slide",
        },
        variants: ["bordered", "with-icon"],
      },
    },
  ),
});

export type Manifest = typeof manifest;
