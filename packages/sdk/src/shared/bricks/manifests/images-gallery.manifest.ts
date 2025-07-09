import { Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { canvasDataURI } from "~/shared/utils/canvas-data-uri";
import { datasourceRef } from "../props/datasource";
import { defineProps, group } from "../props/helpers";
import { IoGridOutline } from "react-icons/io5";
import type { BrickProps } from "../props/types";
import { string, url } from "../props/string";

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
  kind: "widget",
  name: "Gallery",
  description: "An image collection",
  aiInstructions: "This brick should mostly be used for image galleries and collections.",
  defaultInspectorTab: "content",
  isContainer: false,

  icon: IoGridOutline,
  props: defineProps({
    datasource: Type.Optional(datasourceRef()),
    staticImages: Type.Optional(
      Type.Array(Type.Object({ src: url("Image URL"), legend: string("Legend") }), {
        title: "Images",
        default: [],
      }),
    ),
    styles: group({
      title: "Styles",
      children: {
        // layout: containerLayoutRef(),
      },
    }),
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
      styles: {
        layout: {
          type: "grid",
          columns: 3,
          gap: "gap-4",
        },
      },
      staticImages: [
        {
          src: "https://via.placeholder.com/400x400.png?text=Product+1",
          legend: "Premium wireless headphones",
        },
        {
          src: "https://via.placeholder.com/400x400.png?text=Product+2",
          legend: "Bluetooth speaker",
        },
        {
          src: "https://via.placeholder.com/400x400.png?text=Product+3",
          legend: "Smart fitness tracker",
        },
        {
          src: "https://via.placeholder.com/400x400.png?text=Product+4",
          legend: "Wireless charging pad",
        },
      ],
    },
  },
  {
    description: "Team photos gallery (4-column grid)",
    type: "images-gallery",
    props: {
      styles: {
        layout: {
          type: "grid",
          gap: "gap-8",
        },
      },
      staticImages: [
        {
          src: "https://via.placeholder.com/300x300.png?text=CEO",
          legend: "Sarah Johnson - Chief Executive Officer",
        },
        {
          src: "https://via.placeholder.com/300x300.png?text=CTO",
          legend: "Mike Chen - Chief Technology Officer",
        },
        {
          src: "https://via.placeholder.com/300x300.png?text=Design",
          legend: "Emily Rodriguez - Head of Design",
        },
        {
          src: "https://via.placeholder.com/300x300.png?text=Marketing",
          legend: "David Park - Marketing Director",
        },
        {
          src: "https://via.placeholder.com/300x300.png?text=Sales",
          legend: "Lisa Wong - Sales Manager",
        },
        {
          src: "https://via.placeholder.com/300x300.png?text=Support",
          legend: "Alex Thompson - Customer Support Lead",
        },
        {
          src: "https://via.placeholder.com/300x300.png?text=Dev",
          legend: "Carlos Martinez - Senior Developer",
        },
        {
          src: "https://via.placeholder.com/300x300.png?text=HR",
          legend: "Jennifer Adams - HR Specialist",
        },
      ],
    },
  },
  {
    description: "Project showcase (2-column grid with larger spacing)",
    type: "images-gallery",
    props: {
      styles: {
        layout: {
          type: "grid",
          columns: 2,
          gap: "gap-8",
        },
      },
      staticImages: [
        {
          src: "https://via.placeholder.com/600x400.png?text=Website+Redesign",
          legend: "Modern e-commerce website redesign project",
        },
        {
          src: "https://via.placeholder.com/600x400.png?text=Mobile+App",
          legend: "iOS and Android mobile application",
        },
        {
          src: "https://via.placeholder.com/600x400.png?text=Brand+Identity",
          legend: "Complete brand identity design package",
        },
        {
          src: "https://via.placeholder.com/600x400.png?text=Dashboard+UI",
          legend: "Analytics dashboard user interface",
        },
      ],
    },
  },
  {
    description: "Event photos (horizontal flex layout)",
    type: "images-gallery",
    props: {
      styles: {
        layout: {
          type: "flex",
          direction: "flex-row",
          wrap: true,
          gap: "gap-4",
        },
      },
      staticImages: [
        {
          src: "https://via.placeholder.com/250x180.png?text=Opening",
          legend: "Conference opening ceremony",
        },
        {
          src: "https://via.placeholder.com/250x180.png?text=Keynote",
          legend: "Keynote presentation",
        },
        {
          src: "https://via.placeholder.com/250x180.png?text=Workshop",
          legend: "Technical workshop session",
        },
        {
          src: "https://via.placeholder.com/250x180.png?text=Networking",
          legend: "Networking lunch break",
        },
        {
          src: "https://via.placeholder.com/250x180.png?text=Panel",
          legend: "Expert panel discussion",
        },
        {
          src: "https://via.placeholder.com/250x180.png?text=Awards",
          legend: "Awards ceremony",
        },
      ],
    },
  },
];
