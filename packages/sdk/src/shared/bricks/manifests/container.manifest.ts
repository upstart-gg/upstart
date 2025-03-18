import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group } from "../props/helpers";
import { background } from "../props/background";
import { datasourceRef } from "../props/datasource";
import { containerChildren } from "../props/container";
import { Type } from "@sinclair/typebox";

export const datasource = Type.Array(Type.Object({}, { additionalProperties: true }));

// Generic container can hold any type of array data source
export const manifest = defineBrickManifest({
  type: "container",
  kind: "brick",
  name: "Container",
  description: "A container that can hold other bricks and align them horizontally or vertically",
  isContainer: true,
  datasource,
  // svg icon for the "container" brick
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="12" y1="3" x2="12" y2="21"></line></svg>`,
  props: defineProps({
    styles: group({
      title: "Styles",
      children: {
        background: background(),
      },
    }),
    layout: containerChildren(),
    datasource: group({
      title: "Data",
      children: {
        ds: datasourceRef(),
      },
    }),
  }),
});

export type Manifest = typeof manifest;
