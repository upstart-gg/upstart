import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, prop } from "../props/helpers";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { Type } from "@sinclair/typebox";
import { string } from "../props/string";
import { number } from "../props/number";
import { backgroundColor } from "../props/background";
import { border } from "../props/border";
import { padding } from "../props/padding";
import { shadow } from "../props/effects";
import { preset } from "../props/preset";

export const manifest = defineBrickManifest({
  type: "map",
  kind: "widget",
  name: "Map",
  description: "A map element showing a location",
  aiInstructions:
    "This brick can be used to show a location on a map. Use the 'location' prop to set the coordinates and an optional tooltip.",
  icon: LiaMapMarkedAltSolid,
  props: defineProps({
    // preset: optional(preset()),
    location: prop({
      title: "Location",
      description: "The location to display on the map",
      schema: Type.Object({
        lat: number("Latitude"),
        lng: number("Longitude"),
        tooltip: optional(string("Tooltip")),
      }),
    }),
    backgroundColor: optional(backgroundColor()),
    border: optional(border()),
    padding: optional(padding()),
    shadow: optional(shadow()),
  }),
});

export type Manifest = typeof manifest;
