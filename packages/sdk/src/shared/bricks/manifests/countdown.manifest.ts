import { Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";

export const manifest = defineBrickManifest({
  type: "countdown",
  kind: "widget",
  name: "Countdown",
  description: "A countdown timer",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="1" ry="1"></rect>
    <path d="M4 9 L4 15"></path>
    <path d="M4 9 L7 9"></path>
    <path d="M4 12 L7 12"></path>
    <path d="M4 15 L7 15"></path>
    <path d="M7 9 L7 15"></path>
    <path d="M9 9 L9 15"></path>
    <path d="M9 9 L12 9"></path>
    <path d="M9 12 L12 12"></path>
    <path d="M9 15 L12 15"></path>
    <path d="M12 9 L12 15"></path>
    <circle cx="15" cy="10.5" r="0.15"></circle>
    <circle cx="15" cy="13.5" r="0.15"></circle>
    <path d="M17 9 L17 15"></path>
    <path d="M17 9 L20 9"></path>
    <path d="M17 12 L20 12"></path>
    <path d="M17 15 L20 15"></path>
    <path d="M20 9 L20 15"></path>
</svg>`,
  props: defineProps({}),
});

export type Manifest = typeof manifest;
