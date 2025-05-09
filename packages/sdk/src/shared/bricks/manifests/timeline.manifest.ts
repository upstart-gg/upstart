import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, group, prop } from "../props/helpers";
import { Type } from "@sinclair/typebox";
import { MdTimeline } from "react-icons/md";
import { backgroundColor } from "../props/background";
import { color, textContent } from "../props/text";
import { string } from "../props/string";
import { padding } from "../props/padding";
import { border } from "../props/border";
import { shadow } from "../props/effects";

export const manifest = defineBrickManifest({
  type: "timeline",
  kind: "widget",
  name: "Timeline",
  description: "A timeline element for showing chronological events",
  aiInstructions: `
    This timeline element displays a series of chronological events, milestones, or processes.
    It can be used for company history, project roadmaps, or any sequential information.
    Each item has a date/time, title, description, and optional icon.
  `.trim(),
  icon: MdTimeline,

  defaultHeight: { desktop: 12, mobile: 18 },
  defaultWidth: { desktop: 36, mobile: 24 },

  props: defineProps(
    {
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
        title: "Timeline items",
        schema: Type.Array(
          Type.Object({
            date: string("Date", "2024", {
              description: "Date or time period for this event",
            }),
            title: textContent("Title", "Event title", { disableSizing: true }),
            description: textContent("Description", "Event description"),
            icon: optional(
              prop({
                title: "Icon",
                description: "Icon to display (iconify reference)",
                schema: string("Icon", undefined, {
                  description: "Icon for this timeline item",
                  "ui:widget": "iconify",
                }),
              }),
            ),
            color: optional(
              prop({
                title: "Accent color",
                description: "Color for the timeline dot/line",
                schema: Type.Union(
                  [
                    Type.Literal("bg-primary", { title: "Primary" }),
                    Type.Literal("bg-secondary", { title: "Secondary" }),
                    Type.Literal("bg-accent", { title: "Accent" }),
                    Type.Literal("bg-base-content", { title: "Base" }),
                  ],
                  { default: "bg-primary" },
                ),
              }),
            ),
          }),
        ),
      }),
      variants: Type.Array(
        Type.Union(
          [
            Type.Literal("vertical", {
              title: "Vertical",
              description: "Display timeline vertically",
            }),
            Type.Literal("horizontal", {
              title: "Horizontal",
              description: "Display timeline horizontally",
            }),
            Type.Literal("alternating", {
              title: "Alternating",
              description: "Alternate items left and right (vertical only)",
            }),
            Type.Literal("with-connectors", {
              title: "With connectors",
              description: "Show connecting lines between items",
            }),
            Type.Literal("minimal", {
              title: "Minimal",
              description: "Simple design with less visual elements",
            }),
            Type.Literal("card-style", {
              title: "Card style",
              description: "Display each item as a card",
            }),
          ],
          {
            title: "Variant",
            description: "Timeline display variants",
          },
        ),
        { default: ["vertical", "with-connectors"] },
      ),
      appearance: optional(
        group({
          title: "Appearance",
          children: {
            lineColor: optional(backgroundColor("bg-base-300", "Timeline line color")),
            lineWidth: optional(
              prop({
                title: "Line width",
                schema: Type.Union(
                  [
                    Type.Literal("border-2", { title: "Thin" }),
                    Type.Literal("border-4", { title: "Medium" }),
                    Type.Literal("border-8", { title: "Thick" }),
                  ],
                  { default: "border-2" },
                ),
              }),
            ),
            dotSize: optional(
              prop({
                title: "Dot size",
                schema: Type.Union(
                  [
                    Type.Literal("w-3 h-3", { title: "Small" }),
                    Type.Literal("w-4 h-4", { title: "Medium" }),
                    Type.Literal("w-6 h-6", { title: "Large" }),
                  ],
                  { default: "w-4 h-4" },
                ),
              }),
            ),
            datePosition: optional(
              prop({
                title: "Date position",
                schema: Type.Union(
                  [
                    Type.Literal("above", { title: "Above title" }),
                    Type.Literal("below", { title: "Below title" }),
                    Type.Literal("inline", { title: "Inline with title" }),
                  ],
                  { default: "above" },
                ),
              }),
            ),
          },
        }),
      ),
      textStyles: optional(
        group({
          title: "Text styles",
          children: {
            dateColor: optional(color("text-base-content/70", "Date color")),
            titleColor: optional(color("text-base-content", "Title color")),
            descriptionColor: optional(color("text-base-content/80", "Description color")),
          },
        }),
      ),
    },
    {
      default: {
        container: {
          padding: "p-6",
          backgroundColor: "bg-transparent",
        },
        variants: ["vertical", "with-connectors"],
        appearance: {
          lineColor: "bg-base-300",
          lineWidth: "border-2",
          dotSize: "w-4 h-4",
          datePosition: "above",
        },
        textStyles: {
          dateColor: "text-base-content/70",
          titleColor: "text-base-content",
          descriptionColor: "text-base-content/80",
        },
      },
    },
  ),
});

export type Manifest = typeof manifest;
