import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, optional, prop } from "../props/helpers";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { backgroundColorRef } from "../props/background";
import { borderRef } from "../props/border";
import { paddingRef } from "../props/padding";
import { shadowRef } from "../props/effects";
import type { BrickProps } from "../props/types";
import { geolocation } from "../props/geolocation";

export const DEFAULTS = {
  lat: 48.8566, // Default latitude (Paris)
  lng: 2.3522, // Default longitude (Paris)
  zoom: 17,
};

export const manifest = defineBrickManifest({
  type: "map",
  kind: "widget",
  name: "Map",
  description: "A map element showing a location",
  aiInstructions:
    "This brick can be used to show a location on a map. Use the 'location' prop to set the coordinates and an optional tooltip.",
  icon: LiaMapMarkedAltSolid,
  props: defineProps(
    {
      location: group({
        title: "Location",
        children: geolocation({ defaultZoom: DEFAULTS.zoom }),
      }),
      border: optional(borderRef),
      shadow: optional(shadowRef()),
    },
    { noPreset: true },
  ),
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
        address: "San Francisco, CA",
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
        address: "New York, NY",
        tooltip: "New York, NY",
      },
      border: {
        color: "border-gray-300",
        width: "border",
      },
      shadow: "shadow-lg",
    },
  },
];
