import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { RxVideo } from "react-icons/rx";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";
import { borderRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { Type } from "@sinclair/typebox";

export const manifest = defineBrickManifest({
  type: "video",
  kind: "brick",
  name: "Video",
  description: "Youtube video",
  repeatable: true,
  icon: RxVideo,

  minWidth: {
    mobile: 380,
    desktop: 380,
  },
  minHeight: {
    mobile: 168,
    desktop: 168,
  },
  props: defineProps({
    url: string("Video URL", {
      description: "URL of the video to embed. It can be a YouTube link or an embed link.",
      default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    }),
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
