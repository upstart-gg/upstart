import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { commonProps, contentAwareProps, getDatasourcesProp } from "../props/common";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { LAYOUT_COLS } from "~/shared/layout-constants";
import { get } from "node:http";
import { commonStyleProps } from "../props/style-props";
import { canvasDataURI } from "~/shared/utils/canvas-data-uri";

export const manifest = defineBrickManifest({
  type: "images-wall",
  kind: "widget",
  title: "Images wall",
  description: "An image collection",
  isContainer: true,
  preferredWidth: {
    mobile: LAYOUT_COLS.mobile / 2,
    desktop: LAYOUT_COLS.desktop / 4,
  },
  preferredHeight: {
    mobile: 10,
    desktop: 10,
  },
  minWidth: {
    mobile: 10,
    desktop: 10,
  },
  minHeight: {
    mobile: 10,
    desktop: 10,
  },
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <rect x="5" y="5" width="6" height="5" rx="1"></rect>
    <rect x="13" y="5" width="6" height="7" rx="1"></rect>
    <rect x="5" y="12" width="6" height="7" rx="1"></rect>
    <rect x="13" y="14" width="6" height="5" rx="1"></rect>
</svg>
  `,
  props: Type.Composite([
    contentAwareProps,
    commonProps,
    Type.Object({
      imagesWallLayout: Type.Union(
        [
          Type.Literal("flex", { title: "Flex", description: "Images are displayed in a flex layout" }),
          Type.Literal("grid", { title: "Grid", description: "Images are displayed in a grid layout" }),
        ],
        {
          "ui:field": "enum",
          "ui:group": "images-wall-layout",
          "ui:group:order": 0,
          "ui:group:title": "Images layout",
          default: "grid",
        },
      ),
      imagesWallColumns: Type.Number({
        title: "Columns",
        description: "Number of columns",
        "ui:group": "images-wall-layout",
        "ui:field": "slider",
        default: 3,
        minimum: 2,
        maximum: 8,
      }),
      imagesWallGap: Type.Union(
        [
          Type.Literal("gap-0", { title: "None" }),
          Type.Literal("gap-1", { title: "S" }),
          Type.Literal("gap-2", { title: "M" }),
          Type.Literal("gap-4", { title: "L" }),
          Type.Literal("gap-8", { title: "XL" }),
          Type.Literal("gap-16", { title: "XXL" }),
        ],
        {
          title: "Gap",
          description: "Space between images",
          "ui:field": "enum",
          "ui:group": "images-wall-layout",
          default: "gap-1",
        },
      ),
    }),
    commonStyleProps,
    getDatasourcesProp(
      Type.Object(
        {
          images: Type.Array(
            Type.Object({
              src: Type.String({ format: "uri" }),
              alt: Type.String({ default: "" }),
            }),
          ),
        },
        {
          default: {
            images: [
              {
                src: canvasDataURI,
                alt: "my image",
              },
              { src: canvasDataURI, alt: "my image" },
              { src: canvasDataURI, alt: "my image" },
              { src: canvasDataURI, alt: "my image" },
              { src: canvasDataURI, alt: "my image" },
              { src: canvasDataURI, alt: "my image" },
            ],
          },
        },
      ),
    ),
  ]),
  datasources: Type.Object({
    images: Type.Array(
      Type.Object({
        src: Type.String({ format: "uri" }),
        alt: Type.String({ default: "" }),
      }),
    ),
  }),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);
