import { Type } from "@sinclair/typebox";
import { IoGridOutline } from "react-icons/io5";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { imageRef } from "../props/image";
import { paddingRef } from "../props/padding";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";
import { colorPresetRef } from "../props/color-preset";
import { borderRef, roundingRef } from "../props/border";
import { loopRef } from "../props/dynamic";
import { cssLengthRef } from "../props/css-length";

export const manifest = defineBrickManifest({
  type: "images-gallery",
  name: "Gallery",
  category: "media",
  description: "An image collection",
  aiInstructions: "This brick should mostly be used for image galleries and collections.",
  consumesMultipleQueryRows: true,
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
    colorPreset: Type.Optional(
      colorPresetRef({
        title: "Color",
        default: { color: "base-100" },
      }),
    ),
    loop: Type.Optional(loopRef()),
    images: Type.Array(
      Type.Object({
        image: imageRef({
          "ui:responsive": "desktop",
          "ui:no-alt-text": true,
          "ui:no-object-options": true,
          "ui:placeholder": "https://example.com/image.jpg",
        }),
        legend: Type.Optional(string("Legend")),
      }),
      {
        title: "Images",
        default: [],
        maxItems: 12,
        metadata: {
          category: "content",
          consumeQuery: true,
        },
      },
    ),
    columns: Type.Optional(
      Type.Number({
        title: "Columns",
        description:
          "Number of columns. Only applies to desktop screens. On mobile, it will always display 1 column.",
        minimum: 1,
        maximum: 6,
        default: 3,
        "ui:field": "slider",
        "ui:responsive": "desktop",
      }),
    ),
    gap: Type.Optional(
      cssLengthRef({
        title: "Gap",
        description: "The gap between the images.",
        default: "1rem",
        "ui:styleId": "styles:gap",
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
          image: {
            src: "https://via.placeholder.com/400x400.png?text=Product+1",
          },
          legend: "Premium wireless headphones",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x400.png?text=Product+2",
          },
          legend: "Bluetooth speaker",
        },
        {
          image: {
            src: "https://via.placeholder.com/400x400.png?text=Product+3",
          },
          legend: "Smart fitness tracker",
        },
        {
          image: {
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
          image: {
            src: "https://via.placeholder.com/300x300.png?text=CEO",
          },
          legend: "Sarah Johnson - Chief Executive Officer",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=CTO",
          },
          legend: "Mike Chen - Chief Technology Officer",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Design",
          },
          legend: "Emily Rodriguez - Head of Design",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Marketing",
          },
          legend: "David Park - Marketing Director",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Sales",
          },
          legend: "Lisa Wong - Sales Manager",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Support",
          },
          legend: "Alex Thompson - Customer Support Lead",
        },
        {
          image: {
            src: "https://via.placeholder.com/300x300.png?text=Dev",
          },
          legend: "Carlos Martinez - Senior Developer",
        },
        {
          image: {
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
          image: {
            src: "https://via.placeholder.com/600x400.png?text=Website+Redesign",
          },
          legend: "Modern e-commerce website redesign project",
        },
        {
          image: {
            src: "https://via.placeholder.com/600x400.png?text=Mobile+App",
          },
          legend: "iOS and Android mobile application",
        },
        {
          image: {
            src: "https://via.placeholder.com/600x400.png?text=Brand+Identity",
          },
          legend: "Complete brand identity design package",
        },
        {
          image: {
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
          image: {
            src: "https://via.placeholder.com/250x180.png?text=Opening",
          },
          legend: "Conference opening ceremony",
        },
        {
          image: {
            src: "https://via.placeholder.com/250x180.png?text=Keynote",
          },
          legend: "Keynote presentation",
        },
        {
          image: {
            src: "https://via.placeholder.com/250x180.png?text=Workshop",
          },
          legend: "Technical workshop session",
        },
        {
          image: {
            src: "https://via.placeholder.com/250x180.png?text=Networking",
          },
          legend: "Networking lunch break",
        },
        {
          image: {
            src: "https://via.placeholder.com/250x180.png?text=Panel",
          },
          legend: "Expert panel discussion",
        },
        {
          image: {
            src: "https://via.placeholder.com/250x180.png?text=Awards",
          },
          legend: "Awards ceremony",
        },
      ],
    },
  },
];
