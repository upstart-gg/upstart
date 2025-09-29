import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { rounding } from "../props/border";
import { shadow } from "../props/effects";
import { Type } from "@sinclair/typebox";
import { number } from "../props/number";
import type { BrickExample } from "./_types";

export const DEFAULTS = {
  lat: 48.8566, // Default latitude (Paris)
  lng: 2.3522, // Default longitude (Paris)
  zoom: 15, // Default zoom level
};

export const manifest = defineBrickManifest({
  type: "map",
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
    lat: Type.String({ title: "Latitude", "ui:field": "hidden" }),
    lng: Type.String({ title: "Longitude", "ui:field": "hidden" }),
    address: Type.String({
      title: "Address",
      "ui:field": "geoaddress",
      metadata: {
        category: "content",
      },
    }),
    tooltip: Type.Optional(
      Type.String({
        title: "Tooltip",
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
    rounding: Type.Optional(
      rounding({
        default: "rounded-xl",
      }),
    ),
    shadow: Type.Optional(shadow()),
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  {
    description: "Map showing a specific location",
    type: "map",
    props: {
      lat: "37.7749",
      lng: "-122.4194",
      address: "San Francisco, CA",
      tooltip: "San Francisco, CA",
      shadow: "shadow-md",
      width: "40%",
      height: "250px",
    },
  },
  {
    description: "Map with custom styles",
    type: "map",
    props: {
      lat: "40.7128",
      lng: "-74.0060",
      address: "New York, NY",
      tooltip: "New York, NY",
      shadow: "shadow-lg",
      width: "100%",
      height: "400px",
    },
  },
  {
    description: "Business location map with high zoom level and rounded corners",
    type: "map",
    props: {
      lat: "34.0522",
      lng: "-118.2437",
      address: "Los Angeles, CA",
      tooltip: "Our Los Angeles Office",
      zoom: 18,
      rounding: "rounded-2xl",
      shadow: "shadow-xl",
    },
  },
  {
    description: "Event venue map with medium zoom and subtle shadow",
    type: "map",
    props: {
      lat: "41.8781",
      lng: "-87.6298",
      address: "Chicago, IL",
      tooltip: "Conference Center - Chicago",
      zoom: 16,
      rounding: "rounded-lg",
      shadow: "shadow-sm",
    },
  },
  {
    description: "Restaurant location with default zoom and sharp corners",
    type: "map",
    props: {
      lat: "25.7617",
      lng: "-80.1918",
      address: "Miami, FL",
      tooltip: "Oceanview Restaurant & Bar",
      zoom: 15,
      rounding: "rounded-none",
      shadow: "shadow-md",
    },
  },
  {
    description: "Hotel location with low zoom for area overview",
    type: "map",
    props: {
      lat: "36.1699",
      lng: "-115.1398",
      address: "Las Vegas, NV",
      tooltip: "Downtown Las Vegas Hotel",
      zoom: 13,
      rounding: "rounded-xl",
      shadow: "shadow-lg",
    },
  },
  {
    description: "Store location with maximum zoom for street view detail",
    type: "map",
    props: {
      lat: "47.6062",
      lng: "-122.3321",
      address: "Seattle, WA",
      tooltip: "Seattle Flagship Store",
      zoom: 18,
      rounding: "rounded-md",
      shadow: "shadow-sm",
    },
  },
  {
    description: "Park location with moderate zoom and minimal styling",
    type: "map",
    props: {
      lat: "39.7392",
      lng: "-104.9903",
      address: "Denver, CO",
      tooltip: "City Park Recreation Area",
      zoom: 14,
      rounding: "rounded-sm",
    },
  },
  {
    description: "Dynamic business location using company query",
    type: "map",
    props: {
      lat: "{{company.latitude}}",
      lng: "{{company.longitude}}",
      address: "{{company.address}}",
      tooltip: "{{company.name}} - {{company.address}}",
      zoom: 16,
      rounding: "rounded-lg",
      shadow: "shadow-md",
    },
  },
  {
    description: "Dynamic event venue using event query",
    type: "map",
    props: {
      lat: "{{event.venueLatitude}}",
      lng: "{{event.venueLongitude}}",
      address: "{{event.venueAddress}}",
      tooltip: "{{event.title}} - {{event.venueName}}",
      zoom: 17,
      rounding: "rounded-xl",
      shadow: "shadow-lg",
    },
  },
];
