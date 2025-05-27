import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, prop } from "../props/helpers";
import { TiSocialFlickr } from "react-icons/ti";
import { string } from "../props/string";
import { Type } from "@sinclair/typebox";

export const manifest = defineBrickManifest({
  type: "social-links",
  kind: "widget",
  name: "Social links",
  description: "A list of social media links",
  icon: TiSocialFlickr,
  props: defineProps({
    links: Type.Array(
      Type.Object({
        href: string("Link"),
        label: optional(string("Label")),
        icon: optional(
          prop({
            title: "Icon",
            description: "Icon to display (iconify reference)",
            schema: string("Icon", undefined, {
              description: "Icon to display (iconify reference)",
              "ui:widget": "iconify",
            }),
          }),
        ),
      }),
    ),
    variants: Type.Array(
      Type.Union(
        [
          Type.Literal("icon-only", { title: "Only icons", description: "Display only icons" }),
          Type.Literal("display-inline", { title: "Display inline", description: "Display links inline" }),
          Type.Literal("display-block", {
            title: "Display block",
            description: "Display links as block elements",
          }),
        ],
        {
          title: "Variant",
          description: "Social links variants",
        },
      ),
    ),
  }),
});

export type Manifest = typeof manifest;
