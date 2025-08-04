import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { RxVideo } from "react-icons/rx";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";
import { borderRef, roundingRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { Type } from "@sinclair/typebox";
import { paddingRef } from "../props/padding";

export const manifest = defineBrickManifest({
  type: "video",
  name: "Video",
  category: "media",
  description: "Youtube video",
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
    url: string("Video URL", {
      description: "URL of the video to embed. It can be a YouTube link or an embed link.",
      default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      metadata: {
        category: "content",
        "ui:responsive": "desktop",
      },
    }),
    padding: Type.Optional(paddingRef({})),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(borderRef()),
    shadow: Type.Optional(shadowRef()),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
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
];
