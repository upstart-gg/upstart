import { Type } from "@sinclair/typebox";
import { commonProps, commonStyleProps } from "../props/all";
import { defineBrickManifest } from "~/shared/brick-manifest";

// get filename from esm import.meta
export const manifest = defineBrickManifest({
  type: "generic-component",
  name: "Generic component",
  kind: "brick",
  description: "A generic component",
  hideInLibrary: true,
  repeatable: true,
  icon: `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="11" width="16" height="6" rx="2"></rect>
    <line x1="9" y1="14" x2="15" y2="14"></line>
</svg>
  `,
  props: Type.Composite([
    commonProps,
    commonStyleProps,
    Type.Object({
      render: Type.Function([Type.Object({}, { additionalProperties: true })], Type.Any(), {
        title: "React component",
      }),
      componentProps: Type.Optional(Type.Object({}, { additionalProperties: true })),
    }),
  ]),
});

export type Manifest = typeof manifest;
