import { Type } from "@sinclair/typebox";
import { commonProps, commonStyleProps } from "../props/all";
import { defineBrickManifest, type StaticManifest } from "~/shared/brick-manifest";

export const manifest = defineBrickManifest({
  type: "carousel",
  kind: "widget",
  name: "Carousel",
  description: "A carousel element",
  isContainer: true,
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <rect x="6" y="6" width="12" height="8" rx="1"></rect>
    <circle cx="9" cy="17" r="0.5" fill="currentColor"></circle>
    <circle cx="12" cy="17" r="0.5" fill="currentColor"></circle>
    <circle cx="15" cy="17" r="0.5" fill="currentColor"></circle></svg>`,
  props: Type.Composite([commonProps, commonStyleProps]),
});

export type Manifest = StaticManifest<typeof manifest>;
