import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { RxVideo } from "react-icons/rx";
import { string } from "../props/string";

export const manifest = defineBrickManifest({
  type: "video",
  kind: "brick",
  name: "Video",
  description: "Youtube video",
  repeatable: true,
  icon: RxVideo,
  props: defineProps({
    youtubeUrl: string("Video URL (Youtube)"),
  }),
});

export type Manifest = typeof manifest;
