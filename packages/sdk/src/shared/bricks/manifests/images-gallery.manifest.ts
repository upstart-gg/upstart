import { Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { canvasDataURI } from "~/shared/utils/canvas-data-uri";
import { datasourceRef } from "../props/datasource";
import { defineProps, group, optional } from "../props/helpers";
import { containerLayout } from "../props/container";
import { IoGridOutline } from "react-icons/io5";

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
  defaultInspectorTab: "content",
  isContainer: true,
  minWidth: {
    mobile: 10,
    desktop: 10,
  },
  minHeight: {
    mobile: 10,
    desktop: 10,
  },
  icon: IoGridOutline,
  //   icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  //     <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  //     <rect x="5" y="5" width="6" height="5" rx="1"></rect>
  //     <rect x="13" y="5" width="6" height="7" rx="1"></rect>
  //     <rect x="5" y="12" width="6" height="7" rx="1"></rect>
  //     <rect x="13" y="14" width="6" height="5" rx="1"></rect>
  // </svg>`,
  props: defineProps({
    content: optional(datasourceRef()),
    styles: group({
      title: "Styles",
      children: {
        layout: containerLayout(),
      },
    }),
  }),
  datasource,
});

export type Manifest = typeof manifest;
