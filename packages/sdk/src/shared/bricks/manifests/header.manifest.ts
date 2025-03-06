import { Type } from "@sinclair/typebox";
import { commonProps } from "../props/all";
import { defineBrickManifest, type StaticManifest } from "~/shared/brick-manifest";
import { textContentProps } from "../props/text";

export const manifest = defineBrickManifest({
  type: "header",
  kind: "widget",
  name: "Header",
  description: "A header with logo and navigation",
  resizable: false,
  movable: false,
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="8" rx="2" ry="2"></rect>
    <rect x="5" y="13" width="6" height="3" rx="1"></rect>
    <line x1="13" y1="14" x2="15" y2="14"></line>
    <line x1="17" y1="14" x2="19" y2="14"></line></svg>`,
  props: Type.Composite([textContentProps, commonProps]),
});

export type Manifest = StaticManifest<typeof manifest>;
