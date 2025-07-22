import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group } from "../props/helpers";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { borderRef } from "../props/border";
import { shadowRef } from "../props/effects";
import type { BrickProps } from "../props/types";
import { geolocation } from "../props/geolocation";
import { Type } from "@sinclair/typebox";
import { number } from "../props/number";
import { string } from "../props/string";

export const DEFAULTS = {
  lat: 48.8566, // Default latitude (Paris)
  lng: 2.3522, // Default longitude (Paris)
  zoom: 15, // Default zoom level
};

export const manifest = defineBrickManifest({
  type: "map",
  kind: "widget",
  name: "Map",
  description: "A map element showing a location",
  aiInstructions:
    "This brick can be used to show a location on a map. Use the 'location' prop to set the coordinates and an optional tooltip.",
  minWidth: {
    desktop: 280,
    mobile: 280,
  },
  minHeight: {
    desktop: 200,
    mobile: 120,
  },
  defaultHeight: {
    desktop: "320px",
    mobile: "280px",
  },
  defaultWidth: {
    desktop: "380px",
    mobile: "100%",
  },
  icon: LiaMapMarkedAltSolid,
  props: defineProps({
    // location: geolocation({ defaultZoom: DEFAULTS.zoom }),
    lat: number("Latitude", { "ui:field": "hidden" }),
    lng: number("Longitude", { "ui:field": "hidden" }),
    address: string("Address", {
      "ui:field": "geoaddress",
      metadata: {
        category: "content",
      },
    }),
    tooltip: Type.Optional(
      string("Tooltip", {
        metadata: {
          category: "content",
        },
      }),
    ),
    zoom: Type.Optional(
      number("Zoom", {
        description: "Zoom level for the map",
        "ui:instructions": "The zoom level should be between 0 (world view) and 21 (street view).",
        "ui:field": "slider",
        minimum: 12,
        maximum: 18,
        default: DEFAULTS.zoom,
        metadata: {
          category: "content",
        },
      }),
    ),
    border: Type.Optional(
      borderRef({
        default: {
          rounding: "rounded-xl",
        },
      }),
    ),
    shadow: Type.Optional(shadowRef()),
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
      lat: 37.7749,
      lng: -122.4194,
      address: "San Francisco, CA",
      tooltip: "San Francisco, CA",
      shadow: "shadow-md",
    },
  },
  {
    description: "Map with custom styles",
    type: "map",
    props: {
      lat: 40.7128,
      lng: -74.006,
      address: "New York, NY",
      tooltip: "New York, NY",
      border: {
        color: "border-gray-300",
        width: "border",
        rounding: "rounded-lg",
      },
      shadow: "shadow-lg",
    },
  },
];
