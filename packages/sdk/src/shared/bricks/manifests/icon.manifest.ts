import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";

export const manifest = defineBrickManifest({
  type: "icon",
  name: "Icon",
  kind: "brick",
  description: "An icon with optional text",
  repeatable: true,
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <path d="M7 12 L12 7 L17 12 L12 17 Z"></path></svg>`,
  props: defineProps({}),
});

export type Manifest = typeof manifest;
