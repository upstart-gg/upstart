import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, prop } from "../props/helpers";
import { PiConfetti } from "react-icons/pi";
import { string } from "../props/string";
import { Type } from "@sinclair/typebox";
import { textContent } from "../props/text";
import { image } from "../props/image";

export const manifest = defineBrickManifest({
  type: "testimonials",
  name: "Testimonials",
  kind: "widget",
  description: "Display testimonials from users",
  repeatable: false,
  icon: PiConfetti,
  props: defineProps(
    {
      orientation: optional(
        prop({
          title: "Orientation",
          schema: Type.Union(
            [
              Type.Literal("horizontal", { title: "Horizontal" }),
              Type.Literal("vertical", { title: "Vertical" }),
            ],
            { default: "horizontal" },
          ),
        }),
      ),
      testimonials: Type.Array(
        Type.Object({
          author: string("Author", "John Doe"),
          company: optional(string("Company")),
          text: textContent("Text", "Amazing product!"),
          avatar: optional(image("Avatar")),
          socialIcon: optional(
            string("Social Icon", undefined, {
              description: "Iconify reference for the social icon",
              "ui:widget": "iconify",
            }),
          ),
        }),
      ),
    },
    {
      default: {
        orientation: "horizontal",
      },
    },
  ),
});

export type Manifest = typeof manifest;
