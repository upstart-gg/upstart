import { Type } from "@sinclair/typebox";
import { commonProps } from "../props/common";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";

export const manifest = defineBrickManifest({
  type: "form",
  kind: "widget",
  name: "Form",
  description: "A form element",
  isContainer: true,
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <rect x="6" y="6" width="12" height="3" rx="1"></rect>
    <rect x="6" y="11" width="12" height="3" rx="1"></rect>
    <rect x="12" y="17" width="6" height="2" rx="1"
      fill="currentColor"
    ></rect></svg>`,
  props: defineProps({}),
});

export type Manifest = typeof manifest;
