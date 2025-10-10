import { Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/bricks/types";
import { defineProps } from "../props/helpers";
import { colorPreset } from "../props/color-preset";
import { cssLength } from "../props/css-length";
import { border, rounding } from "../props/border";
import { shadow } from "../props/effects";
import { BsListCheck } from "react-icons/bs";
import { loop } from "../props/dynamic";
import type { BrickProps } from "../props/types";
import type { BrickExample } from "./_types";
import { StringEnum } from "~/shared/utils/string-enum";

const timelineItemSchema = Type.Object({
  id: Type.Optional(Type.String({ title: "ID" })),
  title: Type.String({
    title: "Title",
    description: "The main title or headline for this timeline item",
  }),
  subtitle: Type.Optional(
    Type.String({
      title: "Subtitle",
      description: "Optional subtitle or date for this timeline item",
    }),
  ),
  description: Type.Optional(
    Type.String({
      title: "Description",
      description: "Optional detailed description for this timeline item",
    }),
  ),
  date: Type.Optional(
    Type.String({
      title: "Date",
      description: "Date or time period for this timeline item",
    }),
  ),
  icon: Type.Optional(
    Type.String({
      title: "Icon",
      description: "Optional icon name from Iconify for this timeline item",
    }),
  ),
  status: Type.Optional(
    StringEnum(["completed", "current", "upcoming"], {
      enumNames: ["Completed", "Current", "Upcoming"],
      title: "Status",
      description: "Timeline item status for visual styling",
    }),
  ),
});

export const manifest = defineBrickManifest({
  type: "timeline",
  category: "widgets",
  name: "Timeline",
  description:
    "A vertical timeline component to display chronological events, milestones, or processes with optional content for each item",
  icon: BsListCheck,
  consumesMultipleQueryRows: true,
  props: defineProps({
    items: Type.Array(timelineItemSchema, {
      title: "Timeline Items",
      description: "List of timeline items to display",
      "ui:field": "array",
      default: [],
    }),

    $children: Type.Optional(
      Type.Array(Type.Array(Type.Any()), {
        title: "Content",
        description:
          "Optional content blocks for each timeline item. Each array corresponds to content for the timeline item at the same index.",
        "ui:field": "hidden",
        default: [],
      }),
    ),

    // Layout options
    layout: Type.Optional(
      StringEnum(["left", "right", "alternating"], {
        enumNames: ["Left", "Right", "Alternating"],
        title: "Layout",
        description: "Timeline layout style",
        default: "left",
      }),
    ),

    showConnector: Type.Optional(
      Type.Boolean({
        title: "Show Connector Line",
        description: "Whether to show the connecting line between timeline items",
        default: true,
      }),
    ),

    connectorColor: Type.Optional(
      colorPreset({
        title: "Connector Color",
        description: "Color of the timeline connector line",
      }),
    ),

    // Timeline item styling
    itemSpacing: Type.Optional(
      cssLength({
        title: "Item Spacing",
        description: "Vertical spacing between timeline items",
        default: "2rem",
      }),
    ),

    showIcons: Type.Optional(
      Type.Boolean({
        title: "Show Icons",
        description: "Whether to display icons for timeline items",
        default: true,
      }),
    ),
    iconSize: Type.Optional(
      StringEnum(["sm", "md", "lg"], {
        enumNames: ["Small", "Medium", "Large"],
        title: "Icon Size",
        description: "Size of timeline item icons",
        default: "md",
      }),
    ),

    showDates: Type.Optional(
      Type.Boolean({
        title: "Show Dates",
        description: "Whether to display dates for timeline items",
        default: true,
      }),
    ),

    datePosition: Type.Optional(
      StringEnum(["top", "bottom", "inline"], {
        enumNames: ["Top", "Bottom", "Inline"],
        title: "Date Position",
        description: "Position of dates relative to content",
        default: "top",
      }),
    ),

    // Styling
    colorPreset: Type.Optional(
      colorPreset({
        title: "Color Preset",
        description: "Color theme for the timeline",
      }),
    ),

    padding: Type.Optional(
      cssLength({
        title: "Padding",
        description: "Internal padding for the timeline container",
      }),
    ),

    border: Type.Optional(
      border({
        title: "Border",
        description: "Border styling for the timeline container",
      }),
    ),

    shadow: Type.Optional(
      shadow({
        title: "Shadow",
        description: "Shadow effect for the timeline container",
      }),
    ),

    rounding: Type.Optional(
      rounding({
        title: "Rounding",
        description: "Corner rounding for the timeline container",
      }),
    ),

    // Content loop support
    loop: Type.Optional(loop()),
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  {
    description: "Basic timeline with milestones",
    type: "timeline",
    props: {
      items: [
        {
          id: "start",
          title: "Project Kickoff",
          subtitle: "Planning Phase",
          date: "January 2024",
          description: "Initial project planning and team assembly",
          status: "completed",
        },
        {
          id: "development",
          title: "Development Phase",
          subtitle: "Building the Product",
          date: "February - April 2024",
          description: "Core development and feature implementation",
          status: "completed",
        },
        {
          id: "testing",
          title: "Testing & QA",
          subtitle: "Quality Assurance",
          date: "May 2024",
          description: "Comprehensive testing and bug fixes",
          status: "current",
        },
        {
          id: "launch",
          title: "Product Launch",
          subtitle: "Go Live",
          date: "June 2024",
          description: "Official product release and marketing campaign",
          status: "upcoming",
        },
      ],
      layout: "left",
      showConnector: true,
      showIcons: true,
      showDates: true,
    },
  },

  {
    description: "Alternating timeline with custom colors",
    type: "timeline",
    props: {
      items: [
        {
          title: "Company Founded",
          date: "2020",
          description: "Started with a vision to change the industry",
        },
        {
          title: "First Product Launch",
          date: "2021",
          description: "Released our flagship product to market",
        },
        {
          title: "Series A Funding",
          date: "2022",
          description: "Raised $10M to accelerate growth",
        },
        {
          title: "International Expansion",
          date: "2023",
          description: "Opened offices in Europe and Asia",
        },
      ],
      layout: "alternating",
      colorPreset: { color: "primary-500" },
      connectorColor: { color: "primary-300" },
      itemSpacing: "3rem",
    },
  },

  {
    description: "Timeline with content blocks",
    type: "timeline",
    props: {
      items: [
        {
          title: "Research Phase",
          date: "Q1 2024",
          description: "Market research and user interviews",
        },
        {
          title: "Design Phase",
          date: "Q2 2024",
          description: "UI/UX design and prototyping",
        },
      ],
      $children: [
        [
          {
            id: "research-chart",
            type: "text",
            props: { content: "Research findings and insights will be displayed here." },
          },
        ],
        [
          {
            id: "design-mockups",
            type: "text",
            props: { content: "Design mockups and prototypes will be shown here." },
          },
        ],
      ],
    },
  },

  {
    description: "Compact timeline without dates",
    type: "timeline",
    props: {
      items: [
        {
          title: "Initialize Project",
          description: "Set up repository and development environment",
        },
        {
          title: "Implement Core Features",
          description: "Build the main functionality",
        },
        {
          title: "Add Tests",
          description: "Write unit and integration tests",
        },
        {
          title: "Deploy to Production",
          description: "Release to production environment",
        },
      ],
      layout: "left",
      showDates: false,
      showIcons: false,
      itemSpacing: "1.5rem",
      padding: "1rem",
    },
  },

  {
    description: "Timeline with custom icons",
    type: "timeline",
    props: {
      items: [
        {
          title: "Planning",
          icon: "mdi:calendar-check",
          date: "Week 1",
          status: "completed",
        },
        {
          title: "Development",
          icon: "mdi:code-braces",
          date: "Week 2-4",
          status: "completed",
        },
        {
          title: "Testing",
          icon: "mdi:test-tube",
          date: "Week 5",
          status: "current",
        },
        {
          title: "Deployment",
          icon: "mdi:rocket-launch",
          date: "Week 6",
          status: "upcoming",
        },
      ],
      iconSize: "lg",
      datePosition: "bottom",
    },
  },

  {
    description: "Right-aligned timeline",
    type: "timeline",
    props: {
      items: [
        {
          title: "User Registration Opens",
          date: "March 1st",
          description: "Early bird registration begins",
        },
        {
          title: "Speaker Announcements",
          date: "March 15th",
          description: "Keynote speakers revealed",
        },
        {
          title: "Conference Day",
          date: "April 1st",
          description: "The main event begins",
        },
      ],
      layout: "right",
      colorPreset: { color: "secondary-500" },
      border: { width: "border", color: "secondary-200" },
      rounding: "rounded-lg",
      padding: "2rem",
    },
  },

  {
    description: "Timeline with loop data",
    type: "timeline",
    props: {
      items: [],
      loop: {
        over: "milestones",
      },
      layout: "alternating",
      showConnector: true,
    },
  },

  {
    description: "Styled timeline with shadows",
    type: "timeline",
    props: {
      items: [
        {
          title: "Design System",
          subtitle: "Foundation",
          date: "Phase 1",
          description: "Establish design tokens and component library",
        },
        {
          title: "Component Development",
          subtitle: "Implementation",
          date: "Phase 2",
          description: "Build reusable React components",
        },
        {
          title: "Documentation",
          subtitle: "Guidelines",
          date: "Phase 3",
          description: "Create comprehensive usage documentation",
        },
      ],
      colorPreset: { color: "secondary-500" },
      shadow: "shadow-lg",
      border: { width: "border", color: "purple-200" },
      rounding: "rounded-xl",
      padding: "2.5rem",
      itemSpacing: "2.5rem",
      connectorColor: { color: "secondary-300" },
    },
  },
];
