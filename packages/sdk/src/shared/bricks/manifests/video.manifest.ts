import { Type } from "@sinclair/typebox";
import { commonProps } from "../props/all";
import { defineBrickManifest } from "~/shared/brick-manifest";

export const manifest = defineBrickManifest({
  type: "video",
  kind: "brick",
  name: "Video",
  description: "Youtube video",
  repeatable: true,
  icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect
    x="5" y="15"
    width="90" height="70"
    rx="20" ry="20"
    fill="transparent"
    stroke="currentColor"
    stroke-width="4"
  />
  <path
    d="M35 30 L35 70 L75 50 Z"
    fill="transparent"
    stroke="currentColor"
    stroke-width="4"
    stroke-linejoin="round"
  /></svg>`,
  props: Type.Composite([
    Type.Object({
      url: Type.String({
        default: "https://placehold.co/400x200",
        title: "File",
        description: "The image file",
        "ui:field": "file",
      }),
      alt: Type.String({
        title: "Alt Text",
        description: "Alternative text for the image",
        "ui:placeholder": "Your image description",
      }),
    }),
    commonProps,
  ]),
});

export type Manifest = typeof manifest;
