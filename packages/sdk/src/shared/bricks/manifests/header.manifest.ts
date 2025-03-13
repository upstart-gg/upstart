import { Type } from "@sinclair/typebox";
import { commonProps, commonStyleProps } from "../props/all";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { textContentProps } from "../props/text";
import { datasourceRefProps } from "../props/datasource";
import { background } from "../props/background";
import { defineProps, group, prop } from "../props/helpers";
import { propBorder } from "../props/border";
import { propString, propUrlOrPageId } from "../props/string";
import { propImage } from "../props/image";

export const manifest = defineBrickManifest({
  type: "header",
  kind: "widget",
  name: "Header",
  description: "A header with logo and navigation",
  duplicatable: false,
  defaultHeight: {
    desktop: 3,
    mobile: 3,
  },
  maxHeight: {
    desktop: 3,
    mobile: 3,
  },
  minHeight: {
    desktop: 3,
    mobile: 3,
  },
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="8" rx="2" ry="2"></rect>
    <rect x="5" y="13" width="6" height="3" rx="1"></rect>
    <line x1="13" y1="14" x2="15" y2="14"></line>
    <line x1="17" y1="14" x2="19" y2="14"></line></svg>`,

  props: defineProps({
    containerStyles: group({
      title: "Styles",
      children: [propBorder("Container border")],
    }),
    navigation: group({
      title: "Navigation",
      children: [
        prop({
          id: "navItems",
          title: "Nav items",
          schema: Type.Array(
            Type.Object({
              urlOrPageId: propUrlOrPageId("urlOrPageId"),
            }),
            { title: "Navigation items", default: [] },
          ),
        }),
      ],
    }),
    brand: group({
      title: "Brand",
      children: [
        propString("brand_name", "Brand name", "Company name"),
        propImage("logo", "Logo"),
        group({
          title: "Styles",
          children: [propBorder("Brand border")],
        }),
      ],
    }),
  }),
  // props: Type.Composite([
  //   commonProps,
  //   // commonStyleProps,
  //   datasourceRefProps,
  //   Type.Object({
  //     mainContainerStyles: Type.Omit(commonStyleProps, ["layout", "effects", "text"]),
  //     brandPart: Type.Object({
  //       brand: Type.String({ title: "Brand name", default: "Company name" }),
  //       logo: Type.Optional(Type.String({ title: "Logo", format: "uri" })),
  //       styles: Type.Object(
  //         {
  //           background,
  //         },
  //         {
  //           "ui:inspector-tab": "style",
  //         },
  //       ),
  //     }),
  //     navItems: Type.Array(
  //       Type.Object({
  //         label: Type.String({ title: "Label" }),
  //         url: Type.String({ title: "URL" }),
  //       }),
  //       { title: "Navigation items", default: [] },
  //     ),
  //   }),
  // ]),
});

export type Manifest = typeof manifest;
