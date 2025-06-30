import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional } from "../props/helpers";
import { RxVideo } from "react-icons/rx";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";
import { borderRef } from "../props/border";

export const manifest = defineBrickManifest({
  type: "video",
  kind: "brick",
  name: "Video",
  description: "Youtube video",
  repeatable: true,
  icon: RxVideo,
  props: defineProps({
    url: string("Video URL", {
      description: "URL of the video to embed. It can be a YouTube link or an embed link.",
    }),
    border: optional(borderRef()),
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
