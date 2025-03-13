import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { textContent } from "../props/text";

export const manifest = defineBrickManifest({
  type: "button",
  name: "Button",
  repeatable: true,
  description: "A button with text and optional icon",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="11" width="16" height="6" rx="2"></rect>
    <line x1="9" y1="14" x2="15" y2="14"></line>
</svg>
  `,
  props: defineProps({
    label: textContent("Click here", "hero"),
  }),
});

export type Manifest = typeof manifest;
