import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, prop } from "../props/helpers";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { Type } from "@sinclair/typebox";
import { string } from "../props/string";
import { number } from "../props/number";

export const manifest = defineBrickManifest({
  type: "map",
  kind: "widget",
  name: "Map",
  description: "A map element with a location",
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
  }),
});

export type Manifest = typeof manifest;
