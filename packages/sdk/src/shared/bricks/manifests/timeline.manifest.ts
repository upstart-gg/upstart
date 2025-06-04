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
import { RiMapPinTimeLine } from "react-icons/ri";
import type { BrickProps } from "../props/types";

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
  icon: RiMapPinTimeLine,

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

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Company milestone timeline with alternating layout",
    type: "timeline",
    props: {
      container: {
        backgroundColor: "bg-base-100",
        padding: "p-8",
      },
      variants: ["vertical", "alternating", "with-connectors"],
      appearance: {
        lineColor: "bg-primary",
        lineWidth: "border-4",
        dotSize: "w-6 h-6",
        datePosition: "above",
      },
      items: [
        {
          date: "2019",
          title: "Company Founded",
          description: "Started our journey with a vision to revolutionize the industry",
          icon: "mdi:rocket-launch",
          color: "bg-primary",
        },
        {
          date: "2020",
          title: "First Product Launch",
          description: "Released our flagship product to the market with overwhelming response",
          icon: "mdi:product-hunt",
          color: "bg-secondary",
        },
        {
          date: "2021",
          title: "Series A Funding",
          description: "Raised $10M in Series A funding to accelerate growth and expansion",
          icon: "mdi:currency-usd",
          color: "bg-accent",
        },
        {
          date: "2023",
          title: "Global Expansion",
          description: "Opened offices in Europe and Asia, serving customers worldwide",
          icon: "mdi:earth",
          color: "bg-primary",
        },
        {
          date: "2024",
          title: "IPO Planning",
          description: "Preparing for initial public offering and continued growth",
          icon: "mdi:trending-up",
          color: "bg-secondary",
        },
      ],
    },
  },
  {
    description: "Project roadmap with horizontal layout",
    type: "timeline",
    props: {
      container: {
        padding: "p-8",
      },
      variants: ["horizontal", "with-connectors", "card-style"],
      appearance: {
        lineColor: "bg-base-300",
        lineWidth: "border-2",
        dotSize: "w-4 h-4",
        datePosition: "below",
      },
      textStyles: {
        dateColor: "text-primary",
        titleColor: "text-base-content",
        descriptionColor: "text-base-content/80",
      },
      items: [
        {
          date: "Q1 2024",
          title: "Planning Phase",
          description: "Requirements gathering and technical specifications",
          icon: "mdi:clipboard-text",
          color: "bg-primary",
        },
        {
          date: "Q2 2024",
          title: "Development",
          description: "Core feature development and testing",
          icon: "mdi:code-braces",
          color: "bg-secondary",
        },
        {
          date: "Q3 2024",
          title: "Beta Testing",
          description: "User acceptance testing and feedback collection",
          icon: "mdi:test-tube",
          color: "bg-accent",
        },
        {
          date: "Q4 2024",
          title: "Launch",
          description: "Production deployment and go-to-market strategy",
          icon: "mdi:rocket",
          color: "bg-primary",
        },
      ],
    },
  },
  {
    description: "Personal career timeline with minimal design",
    type: "timeline",
    props: {
      container: {
        padding: "p-4",
      },
      variants: ["vertical", "minimal"],
      appearance: {
        lineColor: "bg-base-300",
        lineWidth: "border-2",
        dotSize: "w-3 h-3",
        datePosition: "inline",
      },
      textStyles: {
        dateColor: "text-base-content/60",
        titleColor: "text-base-content",
        descriptionColor: "text-base-content/70",
      },
      items: [
        {
          date: "2020-2024",
          title: "Senior Software Engineer",
          description: "Led development of microservices architecture at Tech Startup Inc.",
          color: "bg-primary",
        },
        {
          date: "2018-2020",
          title: "Full Stack Developer",
          description: "Built scalable web applications using React and Node.js at Digital Agency",
          color: "bg-secondary",
        },
        {
          date: "2016-2018",
          title: "Junior Developer",
          description: "Started career developing mobile apps and learning modern frameworks",
          color: "bg-accent",
        },
        {
          date: "2012-2016",
          title: "Computer Science Degree",
          description: "Bachelor's degree in Computer Science from State University",
          color: "bg-base-content",
        },
      ],
    },
  },
  {
    description: "Product development phases with card styling",
    type: "timeline",
    props: {
      container: {
        backgroundColor: "bg-base-50",
        padding: "p-8",
      },
      variants: ["vertical", "card-style", "with-connectors"],
      appearance: {
        lineColor: "bg-accent",
        lineWidth: "border-4",
        dotSize: "w-6 h-6",
        datePosition: "above",
      },
      textStyles: {
        dateColor: "text-accent",
        titleColor: "text-base-content",
        descriptionColor: "text-base-content/80",
      },
      items: [
        {
          date: "Phase 1",
          title: "Research & Discovery",
          description: "Market research, user interviews, and competitive analysis to understand user needs",
          icon: "mdi:magnify",
          color: "bg-primary",
        },
        {
          date: "Phase 2",
          title: "Design & Prototyping",
          description: "Create wireframes, mockups, and interactive prototypes for user testing",
          icon: "mdi:palette",
          color: "bg-secondary",
        },
        {
          date: "Phase 3",
          title: "Development",
          description: "Build the product using agile methodology with continuous integration",
          icon: "mdi:hammer-wrench",
          color: "bg-accent",
        },
        {
          date: "Phase 4",
          title: "Testing & QA",
          description:
            "Comprehensive testing including unit tests, integration tests, and user acceptance testing",
          icon: "mdi:bug",
          color: "bg-primary",
        },
        {
          date: "Phase 5",
          title: "Launch & Monitor",
          description:
            "Product launch with monitoring, analytics, and continuous improvement based on user feedback",
          icon: "mdi:rocket-launch",
          color: "bg-secondary",
        },
      ],
    },
  },
  {
    description: "Event schedule timeline with large dots",
    type: "timeline",
    props: {
      container: {
        backgroundColor: "bg-primary/5",
        padding: "p-8",
      },
      variants: ["vertical", "with-connectors"],
      appearance: {
        lineColor: "bg-primary/30",
        lineWidth: "border-8",
        dotSize: "w-6 h-6",
        datePosition: "above",
      },
      textStyles: {
        dateColor: "text-primary",
        titleColor: "text-primary",
        descriptionColor: "text-base-content",
      },
      items: [
        {
          date: "9:00 AM",
          title: "Registration & Welcome",
          description: "Check-in, networking breakfast, and welcome address by the CEO",
          icon: "mdi:account-check",
          color: "bg-primary",
        },
        {
          date: "10:00 AM",
          title: "Keynote Presentation",
          description: "Future of Technology: Trends and Innovations Shaping Tomorrow",
          icon: "mdi:presentation",
          color: "bg-secondary",
        },
        {
          date: "11:30 AM",
          title: "Panel Discussion",
          description: "Industry leaders discuss challenges and opportunities in digital transformation",
          icon: "mdi:account-group",
          color: "bg-accent",
        },
        {
          date: "1:00 PM",
          title: "Networking Lunch",
          description: "Catered lunch with opportunities to connect with speakers and attendees",
          icon: "mdi:food",
          color: "bg-primary",
        },
        {
          date: "2:30 PM",
          title: "Workshop Sessions",
          description: "Hands-on workshops covering AI, cloud computing, and cybersecurity",
          icon: "mdi:school",
          color: "bg-secondary",
        },
        {
          date: "4:00 PM",
          title: "Closing Remarks",
          description: "Summary of key insights and announcement of next year's conference",
          icon: "mdi:microphone",
          color: "bg-accent",
        },
      ],
    },
  },
];
