import { Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { array, defineProps, group, optional } from "../props/helpers";
import { number } from "../props/number";
import { string, urlOrPageId } from "../props/string";

export const manifest = defineBrickManifest({
  type: "footer",
  kind: "widget",
  name: "Footer",
  description: "A footer with links and social media icons",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="12" width="18" height="8" rx="2" ry="2"></rect>
    <line x1="6" y1="14.5" x2="8" y2="14.5"></line>
    <line x1="11" y1="14.5" x2="13" y2="14.5"></line>
    <line x1="11" y1="16" x2="13" y2="16"></line>
    <line x1="11" y1="17.5" x2="13" y2="17.5"></line>
    <line x1="16" y1="14.5" x2="18" y2="14.5"></line>
    <line x1="16" y1="16" x2="18" y2="16"></line>
    <line x1="16" y1="17.5" x2="18" y2="17.5"></line></svg>`,
  props: defineProps({
    styles: group({
      title: "Styles",
      children: {
        backgroundColor: string("Background color"),
        columns: number("Columns", 3),
      },
    }),
    links: array(
      Type.Object({
        title: string("Title"),
        url: urlOrPageId(),
        column: optional(number("Column", 1)),
      }),
    ),
  }),
});

export type Manifest = typeof manifest;
