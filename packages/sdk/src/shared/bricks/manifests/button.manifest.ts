import { Type } from "@sinclair/typebox";
import { commonProps, commonStyleProps } from "../props/all";
import { defineBrickManifest, type StaticManifest } from "~/shared/brick-manifest";
import { textContentProps } from "../props/text";

export const manifest = defineBrickManifest({
  type: "button",
  name: "Button",
  repeatable: true,
  description: "A button with text and optional icon",
  icon: `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <!-- Main container -->

    <!-- Button container -->
    <rect x="4" y="11" width="16" height="6" rx="2"></rect>

    <!-- Text line inside button -->
    <line x1="9" y1="14" x2="15" y2="14"></line>
</svg>
  `,
  props: Type.Composite([textContentProps, commonProps, commonStyleProps]),
});

export type Manifest = StaticManifest<typeof manifest>;
