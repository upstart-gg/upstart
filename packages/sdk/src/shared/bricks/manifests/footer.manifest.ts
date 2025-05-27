import { Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { array, defineProps, group, optional } from "../props/helpers";
import { number } from "../props/number";
import { string, urlOrPageId } from "../props/string";
import { VscLayoutPanelOff } from "react-icons/vsc";
import { image } from "../props/image";
import { preset } from "../props/preset";

export const manifest = defineBrickManifest({
  type: "footer",
  kind: "widget",
  name: "Footer",
  description: "A footer with links and an optional logo",
  icon: VscLayoutPanelOff,
  props: defineProps({
    // preset: optional(preset()),
    variants: Type.Array(
      Type.Union(
        [
          Type.Literal("logo-left", { title: "Logo on the left", description: "Logo on the left" }),
          Type.Literal("logo-right", { title: "Logo on the right", description: "Logo on the right" }),
          Type.Literal("logo-center", { title: "Logo on the center", description: "Logo at center" }),
          Type.Literal("multiple-rows", {
            title: "Span on multiple rows.",
            description: "Span on multiple rows. Use when there a a lot of links sections",
          }),
        ],
        {
          title: "Variant",
          description: "Footer variants.",
        },
      ),
    ),
    backgroundColor: optional(string("Background color")),
    logo: optional(image("Logo")),
    linksSections: array(
      Type.Object({
        sectionTitle: string("Links Section title"),
        row: optional(number("Row", 0, { description: "Row number of the section" })),
        links: array(
          Type.Object({
            title: string("Title"),
            url: urlOrPageId(),
            column: optional(number("Column", 1)),
          }),
        ),
      }),
    ),
  }),
});

export type Manifest = typeof manifest;
