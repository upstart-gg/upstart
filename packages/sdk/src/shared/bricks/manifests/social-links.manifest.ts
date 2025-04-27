import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { TiSocialFlickr } from "react-icons/ti";

export const manifest = defineBrickManifest({
  type: "social-links",
  kind: "widget",
  name: "Social links",
  description: "A list of social media links",
  icon: TiSocialFlickr,
  props: defineProps({}),
});

export type Manifest = typeof manifest;
