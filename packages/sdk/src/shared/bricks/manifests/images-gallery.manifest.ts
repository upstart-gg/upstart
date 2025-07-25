import { type Static, Type, type TObject } from "@sinclair/typebox";
import { IoGridOutline } from "react-icons/io5";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { canvasDataURI } from "~/shared/utils/canvas-data-uri";
import { StringEnum } from "~/shared/utils/string-enum";
import { basicGapRef } from "../props/gap";
import { defineProps } from "../props/helpers";
import { imageRef } from "../props/image";
import { paddingRef } from "../props/padding";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";
import { gradientDirectionRef } from "../props/color";
import { colorPresetRef } from "../props/preset";
import { borderRef, roundingRef } from "../props/border";

export const datasource = Type.Array(
  Type.Object({
    src: Type.String({ format: "uri", title: "Image URL" }),
    alt: Type.String({ default: "", title: "Alt text" }),
  }),
  {
    default: [
      {
        src: canvasDataURI,
        alt: "my image",
      },
      { src: canvasDataURI, alt: "my image" },
      { src: canvasDataURI, alt: "my image" },
      { src: canvasDataURI, alt: "my image" },
      { src: canvasDataURI, alt: "my image" },
      { src: canvasDataURI, alt: "my image" },
    ],
  },
);

export type Datasource = typeof datasource;

export const manifest = defineBrickManifest({
  type: "images-gallery",
  name: "Gallery",
  category: "media",
  description: "An image collection",
  aiInstructions: "This brick should mostly be used for image galleries and collections.",
  defaultInspectorTab: "content",
  isContainer: false,
  minHeight: {
    desktop: 200,
  },
  minWidth: {
    desktop: 300,
  },
  defaultWidth: {
    desktop: "400px",
    mobile: "100%",
  },
  icon: IoGridOutline,
  props: defineProps({
    color: Type.Optional(
      colorPresetRef({
        title: "Color",
        "ui:presets": {
          "primary-light": {
            previewBgClass: "bg-primary-light text-primary-content-light",
            value: { main: "bg-primary-light text-primary-content-light border-primary-light" },
            label: "Primary light",
          },
          "primary-light-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-300 to-primary-500 text-primary-content-light",
            value: {
              main: "from-primary-300 to-primary-500 text-primary-content-light border-primary",
            },
            label: "Primary light gradient",
          },
          primary: {
            previewBgClass: "bg-primary text-primary-content",
            label: "Primary",
            value: { main: "bg-primary text-primary-content border-primary" },
          },
          "primary-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-500 to-primary-700 text-primary-content",
            label: "Primary gradient",
            value: { main: "from-primary-500 to-primary-700 text-primary-content border-primary" },
          },
          "primary-dark": {
            previewBgClass: "bg-primary-dark text-primary-content",
            label: "Primary dark",
            value: { main: "bg-primary-dark text-primary-content border-primary-dark" },
          },
          "primary-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-700 to-primary-900 text-primary-content",
            label: "Primary dark gradient",
            value: {
              main: "from-primary-700 to-primary-900 text-primary-content border-primary-dark",
            },
          },
          "secondary-light": {
            previewBgClass: "bg-secondary-light text-secondary-content-light",
            label: "Secondary light",
            value: { main: "bg-secondary-light text-secondary-content-light border-secondary-light" },
          },
          "secondary-light-gradient": {
            previewBgClass:
              "bg-gradient-to-br from-secondary-300 to-secondary-500 text-secondary-content-light",
            label: "Secondary light gradient",
            value: {
              main: "from-secondary-300 to-secondary-500 text-secondary-content-light border-secondary",
            },
          },
          secondary: {
            previewBgClass: "bg-secondary text-secondary-content",
            label: "Secondary",
            value: { main: "bg-secondary text-secondary-content border-secondary" },
          },
          "secondary-gradient": {
            previewBgClass: "bg-gradient-to-br from-secondary-500 to-secondary-700 text-secondary-content",
            label: "Secondary gradient",
            value: {
              main: "from-secondary-500 to-secondary-700 text-secondary-content border-secondary",
            },
          },
          "secondary-dark": {
            previewBgClass: "bg-secondary-dark text-secondary-content",
            label: "Secondary dark",
            value: { main: "bg-secondary-dark text-secondary-content border-secondary-dark" },
          },

          "secondary-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-secondary-700 to-secondary-900 text-secondary-content",
            label: "Secondary dark gradient",
            value: {
              main: "from-secondary-700 to-secondary-900 text-secondary-content border-secondary-dark",
            },
          },

          "accent-light": {
            previewBgClass: "bg-accent-light text-accent-content-light",
            label: "Accent lighter",
            value: { main: "bg-accent-light text-accent-content-light border-accent-light" },
          },

          "accent-light-gradient": {
            previewBgClass: "bg-gradient-to-br from-accent-300 to-accent-500 text-accent-content-light",
            label: "Accent light gradient",
            value: { main: "from-accent-300 to-accent-500 text-accent-content-light border-accent" },
          },
          accent: {
            previewBgClass: "bg-accent text-accent-content",
            label: "Accent",
            value: { main: "bg-accent text-accent-content border-accent" },
          },

          "accent-gradient": {
            previewBgClass: "bg-gradient-to-br from-accent-500 to-accent-700 text-accent-content",
            label: "Accent gradient",
            value: { main: "from-accent-500 to-accent-700 text-accent-content border-accent" },
          },
          "accent-dark": {
            previewBgClass: "bg-accent-dark text-accent-content",
            label: "Accent dark",
            value: { main: "bg-accent-dark text-accent-content border-accent-dark" },
          },

          "accent-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-accent-700 to-accent-900 text-accent-content",
            label: "Accent dark gradient",
            value: { main: "from-accent-700 to-accent-900 text-accent-content border-accent-dark" },
          },
          "neutral-light": {
            previewBgClass: "bg-neutral-light text-neutral-content-light",
            label: "Neutral light",
            value: { main: "bg-neutral-light text-neutral-content-light border-neutral-light" },
          },

          "neutral-light-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-300 to-neutral-500 text-neutral-content-light",
            label: "Neutral light gradient",
            value: {
              main: "from-neutral-300 to-neutral-500 text-neutral-content-light border-neutral",
            },
          },

          neutral: {
            previewBgClass: "bg-neutral text-neutral-content",
            label: "Neutral",
            value: { main: "bg-neutral text-neutral-content border-neutral" },
          },

          "neutral-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-500 to-neutral-700 text-neutral-content",
            label: "Neutral gradient",
            value: { main: "from-neutral-500 to-neutral-700 text-neutral-content border-neutral" },
          },

          "neutral-dark": {
            previewBgClass: "bg-neutral-dark text-neutral-content",
            label: "Neutral dark",
            value: { main: "bg-neutral-dark text-neutral-content border-neutral-dark" },
          },

          "neutral-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-700 to-neutral-900 text-neutral-content",
            label: "Neutral dark gradient",
            value: {
              main: "from-neutral-700 to-neutral-900 text-neutral-content border-neutral-dark",
            },
          },
          base100: {
            previewBgClass: "bg-base-100 text-base-content border-base-200 border-2",
            label: "Base 100",
            value: { main: "bg-base-100 text-base-content border-base-200" },
          },
          base100_primary: {
            previewBgClass: "bg-base-100 text-base-content border-primary border-2",
            label: "Base 100 / Primary",
            value: { main: "bg-base-100 text-base-content border-primary" },
          },
          base100_secondary: {
            previewBgClass: "bg-base-100 text-base-content border-secondary border-2",
            label: "Base 100 / Secondary",
            value: { main: "bg-base-100 text-base-content border-secondary" },
          },
          base100_accent: {
            previewBgClass: "bg-base-100 text-base-content border-accent border-2",
            label: "Base 100 / Accent",
            value: { main: "bg-base-100 text-base-content border-accent" },
          },
          none: { label: "None", value: {} },
        },
        default: "base100",
      }),
    ),
    gradientDirection: Type.Optional(
      gradientDirectionRef("color", {
        default: "bg-gradient-to-br",
      }),
    ),
    images: Type.Array(
      Type.Object({
        src: imageRef({
          "ui:responsive": "desktop",
          "ui:no-alt-text": true,
          "ui:no-object-options": true,
        }),
        legend: Type.Optional(string("Legend")),
      }),
      {
        title: "Images",
        default: [
          // {
          //   src: canvasDataURI,
          //   legend: "Image description",
          // },
          // {
          //   src: canvasDataURI,
          //   legend: "Image description",
          // },
          // {
          //   src: canvasDataURI,
          //   legend: "Image description",
          // },
        ],
        maxItems: 12,
        metadata: {
          category: "content",
        },
      },
    ),
    columns: Type.Optional(
      Type.Number({
        title: "Columns",
        description: "Number of columns (grid layout only)",
        minimum: 1,
        maximum: 6,
        default: 3,
        "ui:field": "slider",
      }),
    ),
    gap: Type.Optional(
      basicGapRef({
        default: "gap-4",
      }),
    ),
    padding: Type.Optional(
      paddingRef({
        default: "p-4",
      }),
    ),
    rounding: Type.Optional(roundingRef()),
    border: Type.Optional(borderRef()),
  }),
  datasource,
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Product portfolio gallery (3-column grid)",
    type: "images-gallery",
    props: {
      columns: 3,
      gap: "gap-4",
      padding: "p-4",
      images: [
        {
          src: {
            src: "https://via.placeholder.com/400x400.png?text=Product+1",
          },
          legend: "Premium wireless headphones",
        },
        {
          src: {
            src: "https://via.placeholder.com/400x400.png?text=Product+2",
          },
          legend: "Bluetooth speaker",
        },
        {
          src: {
            src: "https://via.placeholder.com/400x400.png?text=Product+3",
          },
          legend: "Smart fitness tracker",
        },
        {
          src: {
            src: "https://via.placeholder.com/400x400.png?text=Product+4",
          },
          legend: "Wireless charging pad",
        },
      ],
    },
  },
  {
    description: "Team photos gallery (4-column grid)",
    type: "images-gallery",
    props: {
      columns: 4,
      gap: "gap-6",
      padding: "p-6",
      images: [
        {
          src: {
            src: "https://via.placeholder.com/300x300.png?text=CEO",
          },
          legend: "Sarah Johnson - Chief Executive Officer",
        },
        {
          src: {
            src: "https://via.placeholder.com/300x300.png?text=CTO",
          },
          legend: "Mike Chen - Chief Technology Officer",
        },
        {
          src: {
            src: "https://via.placeholder.com/300x300.png?text=Design",
          },
          legend: "Emily Rodriguez - Head of Design",
        },
        {
          src: {
            src: "https://via.placeholder.com/300x300.png?text=Marketing",
          },
          legend: "David Park - Marketing Director",
        },
        {
          src: {
            src: "https://via.placeholder.com/300x300.png?text=Sales",
          },
          legend: "Lisa Wong - Sales Manager",
        },
        {
          src: {
            src: "https://via.placeholder.com/300x300.png?text=Support",
          },
          legend: "Alex Thompson - Customer Support Lead",
        },
        {
          src: {
            src: "https://via.placeholder.com/300x300.png?text=Dev",
          },
          legend: "Carlos Martinez - Senior Developer",
        },
        {
          src: {
            src: "https://via.placeholder.com/300x300.png?text=HR",
          },
          legend: "Jennifer Adams - HR Specialist",
        },
      ],
    },
  },
  {
    description: "Project showcase (2-column grid with larger spacing)",
    type: "images-gallery",
    props: {
      columns: 2,
      gap: "gap-6",
      padding: "p-6",
      images: [
        {
          src: {
            src: "https://via.placeholder.com/600x400.png?text=Website+Redesign",
          },
          legend: "Modern e-commerce website redesign project",
        },
        {
          src: {
            src: "https://via.placeholder.com/600x400.png?text=Mobile+App",
          },
          legend: "iOS and Android mobile application",
        },
        {
          src: {
            src: "https://via.placeholder.com/600x400.png?text=Brand+Identity",
          },
          legend: "Complete brand identity design package",
        },
        {
          src: {
            src: "https://via.placeholder.com/600x400.png?text=Dashboard+UI",
          },
          legend: "Analytics dashboard user interface",
        },
      ],
    },
  },
  {
    description: "Event photos",
    type: "images-gallery",
    props: {
      columns: 4,
      gap: "gap-6",
      padding: "p-6",
      images: [
        {
          src: {
            src: "https://via.placeholder.com/250x180.png?text=Opening",
          },
          legend: "Conference opening ceremony",
        },
        {
          src: {
            src: "https://via.placeholder.com/250x180.png?text=Keynote",
          },
          legend: "Keynote presentation",
        },
        {
          src: {
            src: "https://via.placeholder.com/250x180.png?text=Workshop",
          },
          legend: "Technical workshop session",
        },
        {
          src: {
            src: "https://via.placeholder.com/250x180.png?text=Networking",
          },
          legend: "Networking lunch break",
        },
        {
          src: {
            src: "https://via.placeholder.com/250x180.png?text=Panel",
          },
          legend: "Expert panel discussion",
        },
        {
          src: {
            src: "https://via.placeholder.com/250x180.png?text=Awards",
          },
          legend: "Awards ceremony",
        },
      ],
    },
  },
];
