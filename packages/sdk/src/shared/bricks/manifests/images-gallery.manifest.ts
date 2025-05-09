import { Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { canvasDataURI } from "~/shared/utils/canvas-data-uri";
import { datasourceRef } from "../props/datasource";
import { defineProps, group, optional } from "../props/helpers";
import { containerLayout } from "../props/container";
import { IoGridOutline } from "react-icons/io5";
import { preset } from "../props/preset";

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
  props: defineProps({
    // preset: optional(preset()),
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
