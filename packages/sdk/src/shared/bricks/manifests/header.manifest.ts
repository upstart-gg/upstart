import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, prop } from "../props/helpers";
import { border } from "../props/border";
import { string, urlOrPageId } from "../props/string";
import { image } from "../props/image";
import { backgroundColor } from "../props/background";
import { color } from "../props/text";

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
      title: "Container styles",
      children: { border: border(), backgroundColor: backgroundColor() },
    }),
    navigation: group({
      title: "Navigation",
      children: {
        navItems: prop({
          title: "Nav items",
          schema: Type.Array(
            Type.Object({
              urlOrPageId: urlOrPageId(),
            }),
            { title: "Navigation items", default: [] },
          ),
        }),
      },
    }),
    brand: group({
      title: "Brand",
      children: {
        brandName: string("Brand name", "Acme Inc."),
        logo: image("Logo"),
        styles: group({
          title: "Styles",
          children: {
            color: color(),
          },
        }),
      },
    }),
  }),
});

export type Manifest = typeof manifest;

// for testing
type Props = Static<typeof manifest.props>;
