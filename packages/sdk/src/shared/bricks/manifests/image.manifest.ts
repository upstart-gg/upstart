import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { image } from "../props/image";

export const manifest = defineBrickManifest({
  type: "image",
  kind: "brick",
  name: "Image",
  description: "An image brick",
  repeatable: true,
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline></svg>`,
  props: defineProps({
    image: image(),
  }),
});

export type Manifest = typeof manifest;
