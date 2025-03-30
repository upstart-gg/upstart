import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { RxVideo } from "react-icons/rx";

export const manifest = defineBrickManifest({
  type: "video",
  kind: "brick",
  name: "Video",
  description: "Youtube video",
  repeatable: true,
  icon: RxVideo,
  // icon: `
  //   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  // <rect
  //   x="5" y="15"
  //   width="90" height="70"
  //   rx="20" ry="20"
  //   fill="transparent"
  //   stroke="currentColor"
  //   stroke-width="4"
  // />
  // <path
  //   d="M35 30 L35 70 L75 50 Z"
  //   fill="transparent"
  //   stroke="currentColor"
  //   stroke-width="4"
  //   stroke-linejoin="round"
  // /></svg>`,
  props: defineProps({}),
});

export type Manifest = typeof manifest;
