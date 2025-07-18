import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group } from "../props/helpers";
import { Type } from "@sinclair/typebox";
import { backgroundColorRef } from "../props/background";
import { textContentRef } from "../props/text";
import { iconRef, string } from "../props/string";
import { paddingRef } from "../props/padding";
import { borderRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { RiMapPinTimeLine } from "react-icons/ri";
import type { BrickProps } from "../props/types";
import { colorRef } from "../props/color";
import { StringEnum } from "~/shared/utils/string-enum";

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
  defaultWidth: { desktop: "200px", mobile: "100%" },
  props: defineProps(
    {
      container: Type.Optional(
        group({
          title: "Container",
          children: {
            backgroundColor: Type.Optional(backgroundColorRef()),
            padding: Type.Optional(paddingRef()),
            border: Type.Optional(borderRef()),
            shadow: Type.Optional(shadowRef()),
          },
        }),
      ),
      items: Type.Array(
        Type.Object({
          date: string("Date", {
            default: "2024",
            description: "Date or time period for this event",
          }),
          title: textContentRef({ title: "Title", default: "Event title", disableSizing: true }),
          description: textContentRef({ title: "Description", default: "Event description" }),
          icon: Type.Optional(iconRef()),
        }),
        {
          title: "Timeline items",
        },
      ),
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
      appearance: Type.Optional(
        group({
          title: "Appearance",
          children: {
            lineColor: Type.Optional(
              StringEnum(["primary", "secondary", "accent"], {
                title: "Line color",
                description: "Color for the timeline dot/line",
                default: "primary",
                enumNames: ["Primary", "Secondary", "Accent"],
              }),
            ),
            lineWidth: Type.Optional(
              Type.Union(
                [
                  Type.Literal("border-2", { title: "Thin" }),
                  Type.Literal("border-4", { title: "Medium" }),
                  Type.Literal("border-8", { title: "Thick" }),
                ],
                { title: "Line width", default: "border-2" },
              ),
            ),
            dotSize: Type.Optional(
              Type.Union(
                [
                  Type.Literal("w-3", { title: "S" }),
                  Type.Literal("w-4", { title: "M" }),
                  Type.Literal("w-6", { title: "L" }),
                  Type.Literal("w-8", { title: "XL" }),
                ],
                { title: "Dot size", default: "w-4" },
              ),
            ),
            datePosition: Type.Optional(
              Type.Union(
                [
                  Type.Literal("above", { title: "Above title" }),
                  Type.Literal("below", { title: "Below title" }),
                  Type.Literal("inline", { title: "Inline with title" }),
                ],
                { title: "Date position", default: "above" },
              ),
            ),
          },
        }),
      ),
      textStyles: Type.Optional(
        group({
          title: "Text styles",
          children: {
            dateColor: Type.Optional(colorRef({ default: "text-base-content/70", title: "Date color" })),
            titleColor: Type.Optional(colorRef({ default: "text-base-content", title: "Title color" })),
            descriptionColor: Type.Optional(
              colorRef({ default: "text-base-content/80", title: "Description color" }),
            ),
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
          lineColor: "primary",
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
        lineColor: "primary",
        lineWidth: "border-4",
        dotSize: "w-6",
        datePosition: "above",
      },
      items: [
        {
          date: "2019",
          title: "Company Founded",
          description: "Started our journey with a vision to revolutionize the industry",
          icon: "mdi:rocket-launch",
        },
        {
          date: "2020",
          title: "First Product Launch",
          description: "Released our flagship product to the market with overwhelming response",
          icon: "mdi:product-hunt",
        },
        {
          date: "2021",
          title: "Series A Funding",
          description: "Raised $10M in Series A funding to accelerate growth and expansion",
          icon: "mdi:currency-usd",
        },
        {
          date: "2023",
          title: "Global Expansion",
          description: "Opened offices in Europe and Asia, serving customers worldwide",
          icon: "mdi:earth",
        },
        {
          date: "2024",
          title: "IPO Planning",
          description: "Preparing for initial public offering and continued growth",
          icon: "mdi:trending-up",
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
        lineColor: "accent",
        lineWidth: "border-2",
        dotSize: "w-4",
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
        },
        {
          date: "Q2 2024",
          title: "Development",
          description: "Core feature development and testing",
          icon: "mdi:code-braces",
        },
        {
          date: "Q3 2024",
          title: "Beta Testing",
          description: "User acceptance testing and feedback collection",
          icon: "mdi:test-tube",
        },
        {
          date: "Q4 2024",
          title: "Launch",
          description: "Production deployment and go-to-market strategy",
          icon: "mdi:rocket",
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
        lineColor: "secondary",
        lineWidth: "border-2",
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
        },
        {
          date: "2018-2020",
          title: "Full Stack Developer",
          description: "Built scalable web applications using React and Node.js at Digital Agency",
        },
        {
          date: "2016-2018",
          title: "Junior Developer",
          description: "Started career developing mobile apps and learning modern frameworks",
        },
        {
          date: "2012-2016",
          title: "Computer Science Degree",
          description: "Bachelor's degree in Computer Science from State University",
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
        lineColor: "accent",
        lineWidth: "border-4",
        dotSize: "w-6",
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
        },
        {
          date: "Phase 2",
          title: "Design & Prototyping",
          description: "Create wireframes, mockups, and interactive prototypes for user testing",
          icon: "mdi:palette",
        },
        {
          date: "Phase 3",
          title: "Development",
          description: "Build the product using agile methodology with continuous integration",
          icon: "mdi:hammer-wrench",
        },
        {
          date: "Phase 4",
          title: "Testing & QA",
          description:
            "Comprehensive testing including unit tests, integration tests, and user acceptance testing",
          icon: "mdi:bug",
        },
        {
          date: "Phase 5",
          title: "Launch & Monitor",
          description:
            "Product launch with monitoring, analytics, and continuous improvement based on user feedback",
          icon: "mdi:rocket-launch",
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
        lineColor: "primary",
        lineWidth: "border-8",
        dotSize: "w-6",
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
        },
        {
          date: "10:00 AM",
          title: "Keynote Presentation",
          description: "Future of Technology: Trends and Innovations Shaping Tomorrow",
          icon: "mdi:presentation",
        },
        {
          date: "11:30 AM",
          title: "Panel Discussion",
          description: "Industry leaders discuss challenges and opportunities in digital transformation",
          icon: "mdi:account-group",
        },
        {
          date: "1:00 PM",
          title: "Networking Lunch",
          description: "Catered lunch with opportunities to connect with speakers and attendees",
          icon: "mdi:food",
        },
        {
          date: "2:30 PM",
          title: "Workshop Sessions",
          description: "Hands-on workshops covering AI, cloud computing, and cybersecurity",
          icon: "mdi:school",
        },
        {
          date: "4:00 PM",
          title: "Closing Remarks",
          description: "Summary of key insights and announcement of next year's conference",
          icon: "mdi:microphone",
        },
      ],
    },
  },
];
