import { Type } from "@sinclair/typebox";
import { commonProps, commonStyleProps } from "../props/all";
import { defineBrickManifest, type StaticManifest } from "~/shared/brick-manifest";
import { textContentProps } from "../props/text";

export const manifest = defineBrickManifest({
  type: "text",
  kind: "brick",
  name: "Text",
  description: "Text with formatting options",
  repeatable: true,
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 7h16M4 12h16M4 17h16"></path></svg>`,
  props: Type.Composite([commonProps, commonStyleProps, textContentProps]),
});

export type Manifest = StaticManifest<typeof manifest>;
