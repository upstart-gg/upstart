import { Type } from "@sinclair/typebox";
import { commonProps } from "../props/all";
import { defineBrickManifest } from "~/shared/brick-manifest";

export const manifest = defineBrickManifest({
  type: "social-links",
  kind: "widget",
  name: "Social links",
  description: "A list of social media links",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8" cy="8" r="1" fill="currentColor"></circle>
    <line x1="11" y1="7" x2="16" y2="7"></line>
    <line x1="11" y1="9" x2="13" y2="9" stroke-width="0.5"></line>
    <circle cx="8" cy="12" r="1" fill="currentColor"></circle>
    <line x1="11" y1="11" x2="16" y2="11"></line>
    <line x1="11" y1="13" x2="13.5" y2="13" stroke-width="0.5"></line>
    <circle cx="8" cy="16" r="1" fill="currentColor"></circle>
    <line x1="11" y1="15" x2="16" y2="15"></line>
    <line x1="11" y1="17" x2="13" y2="17" stroke-width="0.5"></line>
    </svg>`,
  props: Type.Composite([commonProps]),
});

export type Manifest = typeof manifest;
