import { Type } from "@sinclair/typebox";
import { commonProps } from "../props/all";
import { defineBrickManifest, type StaticManifest } from "~/shared/brick-manifest";

export const manifest = defineBrickManifest({
  type: "map",
  kind: "widget",
  name: "Map",
  description: "A map element with a location",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <path d="M3 9 L21 9" stroke-width="0.3"></path>
        <path d="M9 3 L9 21" stroke-width="0.3"></path>
        <path d="M15 3 L15 21" stroke-width="0.3"></path>
        <path d="M3 15 L21 15" stroke-width="0.3"></path>
        <path d="M12 5 C10.3431 5 9 6.34315 9 8 C9 9.3124 9.84285 10.4274 11 10.8229 L12 13 L13 10.8229
        C14.1571 10.4274 15 9.3124 15 8 C15 6.34315 13.6569 5 12 5Z"></path></svg>`,
  props: Type.Composite([commonProps]),
});

export type Manifest = StaticManifest<typeof manifest>;
