import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { LiaMapMarkedAltSolid } from "react-icons/lia";

export const manifest = defineBrickManifest({
  type: "map",
  kind: "widget",
  name: "Map",
  description: "A map element with a location",
  icon: LiaMapMarkedAltSolid,
  props: defineProps({}),
});

export type Manifest = typeof manifest;
