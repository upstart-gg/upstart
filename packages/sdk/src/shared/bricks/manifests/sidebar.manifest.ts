import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { VscLayoutSidebarLeftOff } from "react-icons/vsc";

export const manifest = defineBrickManifest({
  type: "sidebar",
  kind: "widget",
  name: "Sidebar",
  description: "A sidebard element",
  icon: VscLayoutSidebarLeftOff,
  props: defineProps({}),
});

export type Manifest = typeof manifest;
