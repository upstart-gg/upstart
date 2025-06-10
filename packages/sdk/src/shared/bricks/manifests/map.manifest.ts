import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, prop } from "../props/helpers";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { Type } from "@sinclair/typebox";
import { string } from "../props/string";
import { number } from "../props/number";
import { backgroundColor, backgroundColorRef } from "../props/background";
import { border, borderRef } from "../props/border";
import { padding, paddingRef } from "../props/padding";
import { shadow, shadowRef } from "../props/effects";
import type { BrickProps } from "../props/types";
import type { FC } from "react";

export const manifest = defineBrickManifest({
  type: "map",
  kind: "widget",
  name: "Map",
  description: "A map element showing a location",
  aiInstructions:
    "This brick can be used to show a location on a map. Use the 'location' prop to set the coordinates and an optional tooltip.",
  icon: LiaMapMarkedAltSolid,
  props: defineProps({
    location: prop({
      title: "Location",
      description: "The location to display on the map",
      schema: Type.Object({
        lat: number("Latitude"),
        lng: number("Longitude"),
        tooltip: optional(string("Tooltip")),
      }),
    }),
    backgroundColor: optional(backgroundColorRef()),
    border: optional(borderRef),
    padding: optional(paddingRef),
    shadow: optional(shadowRef()),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Map showing a specific location",
    type: "map",
    props: {
      location: {
        lat: 37.7749,
        lng: -122.4194,
        tooltip: "San Francisco, CA",
      },
    },
  },
  {
    description: "Map with custom styles",
    type: "map",
    props: {
      location: {
        lat: 40.7128,
        lng: -74.006,
        tooltip: "New York, NY",
      },
      backgroundColor: "bg-gray-100",
      border: {
        color: "border-gray-300",
        width: "border",
      },
      padding: "p-16",
      shadow: "shadow-lg",
    },
  },
];
