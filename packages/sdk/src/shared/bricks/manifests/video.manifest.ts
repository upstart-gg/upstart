import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { RxVideo } from "react-icons/rx";
import { border, rounding } from "../props/border";
import { shadow } from "../props/effects";
import { Type } from "@sinclair/typebox";
import { cssLength } from "../props/css-length";
import type { BrickExample } from "./_types";

export const manifest = defineBrickManifest({
  type: "video",
  name: "Video",
  category: "media",
  description: "An embedded video player for YouTube / Vimeo / Wistia links",
  icon: RxVideo,
  defaultWidth: {
    mobile: "auto",
    desktop: `${(360 * 16) / 9}px`, // 16:9 aspect ratio
  },
  defaultHeight: {
    mobile: "168px",
    desktop: "360px", // 16:9 aspect ratio
  },
  minWidth: {
    mobile: 300,
    desktop: (360 * 16) / 9,
  },
  minHeight: {
    mobile: 168,
    desktop: 360, // 16:9 aspect ratio
  },
  props: defineProps({
    url: Type.String({
      title: "Video URL",
      description:
        "URL of the video to embed. It can be a YouTube link or an embed link. It also supports Vimeo and Wistia links.",
      default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      metadata: {
        category: "content",
        "ui:responsive": "desktop",
      },
    }),
    padding: Type.Optional(
      cssLength({
        description: "Padding inside the video player.",
        "ai:instructions": "Use only a single value like '1rem' or '10px'",
        title: "Padding",
        "ui:responsive": true,
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
    rounding: Type.Optional(
      rounding({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(border()),
    shadow: Type.Optional(shadow()),
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  {
    description: "A YouTube video",
    type: "video",
    props: {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  },
  {
    description: "An embedded YouTube video",
    type: "video",
    props: {
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
  },
  {
    description: "A Vimeo video",
    type: "video",
    props: {
      url: "https://vimeo.com/123456789",
    },
  },
  {
    description: "Dynamic course video using course query",
    type: "video",
    props: {
      url: "{{course.videoUrl}}",
      padding: "1rem",
      rounding: "rounded-lg",
      shadow: "shadow-md",
    },
  },
  {
    description: "Dynamic product demo video using product query",
    type: "video",
    props: {
      url: "{{product.demoVideoUrl}}",
      padding: "0.5rem",
      rounding: "rounded-xl",
      shadow: "shadow-lg",
      border: {
        width: "border-2",
        color: "border-primary-300",
      },
    },
  },
];
