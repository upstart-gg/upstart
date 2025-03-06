import { Type } from "@sinclair/typebox";
import { commonProps, commonStyleProps } from "../props/all";
import { defineBrickManifest, type StaticManifest } from "~/shared/brick-manifest";
import { containerChildrenProps, containerLayoutProps } from "../props/container";
import { datasourceRefProps } from "../props/datasource";

// Generic container can hold any type of array data source
export const manifest = defineBrickManifest({
  type: "container",
  kind: "brick",
  name: "Container",
  description: "A container that can hold other bricks and align them horizontally or vertically",
  isContainer: true,
  // svg icon for the "container" brick
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="12" y1="3" x2="12" y2="21"></line></svg>
  `,
  props: Type.Composite([
    containerLayoutProps,
    containerChildrenProps,
    commonProps,
    datasourceRefProps,
    commonStyleProps,
  ]),
});

export type Manifest = StaticManifest<typeof manifest>;
