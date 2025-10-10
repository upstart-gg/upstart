import { defineBrickManifest } from "~/shared/bricks/types";
import { defineProps } from "../props/helpers";
import { Type } from "@sinclair/typebox";
import { border, rounding } from "../props/border";
import { shadow } from "../props/effects";
import { cssLength } from "../props/css-length";
import { HiOutlineViewColumns } from "react-icons/hi2";
import { colorPreset } from "../props/color-preset";
import { loop } from "../props/dynamic";
import { StringEnum } from "~/shared/utils/string-enum";
import type { BrickExample } from "./_types";
import { TfiLayoutTabWindow } from "react-icons/tfi";

// Tab configuration schema
const tabRef = Type.Object({
  label: Type.String({
    title: "Tab Label",
    description: "The text shown on the tab button",
    "ai:instructions": "Use a short, descriptive label for the tab",
  }),
  id: Type.Optional(
    Type.String({
      title: "Tab ID",
      description: "Unique identifier for the tab (auto-generated if not provided)",
    }),
  ),
});

export const manifest = defineBrickManifest({
  type: "tabs",
  category: "container",
  name: "Tabs",
  description: "A tabbed container that displays different content panels based on the selected tab.",
  aiInstructions:
    "Tabs are containers for organizing content into multiple panels. Each tab has a label and contains child bricks. Users can click tab buttons to switch between different content panels. Ideal for organizing related content, settings panels, or product information.",
  isContainer: true,
  consumesMultipleQueryRows: true,
  defaultWidth: {
    desktop: "100%",
    mobile: "100%",
  },
  defaultHeight: {
    desktop: "auto",
  },
  icon: TfiLayoutTabWindow,
  props: defineProps({
    colorPreset: Type.Optional(
      colorPreset({
        title: "Color",
      }),
    ),
    tabs: Type.Array(tabRef, {
      title: "Tabs",
      description: "List of tab configurations",
      default: [{ label: "Tab 1" }, { label: "Tab 2" }],
      "ai:instructions":
        "Each tab should have a descriptive label. Content for each tab is defined in the $children array.",
      examples: [
        [{ label: "Overview" }, { label: "Features" }, { label: "Pricing" }],
        [{ label: "About" }, { label: "Services" }, { label: "Contact" }],
      ],
    }),
    defaultTab: Type.Optional(
      Type.Number({
        title: "Default Tab",
        description: "Index of the tab to show by default (0-based)",
        default: 0,
        minimum: 0,
        "ai:instructions": "Use 0 for the first tab, 1 for the second tab, etc.",
      }),
    ),
    tabPosition: Type.Optional(
      StringEnum(["top", "bottom"], {
        title: "Tab Position",
        description: "Position of the tab buttons relative to content",
        default: "top",
        "ai:instructions":
          "Use 'top' for tabs above content (most common) or 'bottom' for tabs below content",
      }),
    ),
    tabStyle: Type.Optional(
      StringEnum(["pills", "underline", "bordered"], {
        title: "Tab Style",
        description: "Visual style of the tab buttons",
        default: "underline",
        "ai:instructions":
          "Pills are rounded buttons, underline shows a line under active tab, bordered shows tabs with borders",
      }),
    ),
    fullWidth: Type.Optional(
      Type.Boolean({
        title: "Full Width Tabs",
        description: "Make tab buttons span the full width of the container",
        default: false,
        "ai:instructions": "Enable this to make tab buttons evenly distribute across the full width",
      }),
    ),
    padding: Type.Optional(
      cssLength({
        default: "1.5rem",
        description: "Padding inside each tab panel.",
        "ai:instructions": "Use values like '1rem', '1.5rem', or '2rem' for tab content padding",
        title: "Content Padding",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
    gap: Type.Optional(
      cssLength({
        title: "Tab Gap",
        default: "0.5rem",
        description: "Gap between tab buttons.",
        "ai:instructions": "Small values like '0.25rem' or '0.5rem' work best for tab spacing",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:gap",
      }),
    ),
    rounding: rounding({
      default: "rounded-md",
    }),
    border: Type.Optional(border()),
    shadow: Type.Optional(shadow()),
    loop: Type.Optional(loop()),
    $children: Type.Array(Type.Any(), {
      "ui:field": "hidden",
      description:
        "Array of child bricks - each item represents the content for one tab. If you want multiple bricks in one tab, use a 'box' brick as the single child for that tab.",
      examples: [
        [
          // Tab 1 content
          {
            type: "text",
            props: {
              content: "<h3>Overview</h3><p>This is the overview tab content.</p>",
            },
          },
          // Tab 2 content
          [
            {
              type: "text",
              props: {
                content: "<h3>Features</h3><p>Here are our key features.</p>",
              },
            },
          ],
        ],
      ],
    }),
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [];
