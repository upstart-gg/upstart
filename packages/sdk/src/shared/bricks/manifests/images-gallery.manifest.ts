import { Type } from "@sinclair/typebox";
import { IoGridOutline } from "react-icons/io5";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { basicGapRef } from "../props/gap";
import { defineProps } from "../props/helpers";
import { imageRef } from "../props/image";
import { paddingRef } from "../props/padding";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";
import { gradientDirectionRef } from "../props/color";
import { colorPresetRef } from "../props/color-preset";
import { borderRef, roundingRef } from "../props/border";

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
        default: "bg-base-100 text-base-content-100",
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
        "ui:responsive": "desktop",
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
