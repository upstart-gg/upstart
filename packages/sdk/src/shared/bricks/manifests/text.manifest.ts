import { defineBrickManifest } from "~/shared/brick-manifest";
import { textContent } from "../props/text";
import { defineProps, group } from "../props/helpers";
import { backgroundColor } from "../props/background";

export const manifest = defineBrickManifest({
  type: "text",
  kind: "brick",
  name: "Text",
  description: "Text with formatting options",
  repeatable: true,
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 7h16M4 12h16M4 17h16"></path></svg>`,
  props: defineProps({
    content: textContent(),
    styles: group({
      title: "Styles",
      children: {
        backgroundColor: backgroundColor(),
      },
    }),
  }),
});

export type Manifest = typeof manifest;
