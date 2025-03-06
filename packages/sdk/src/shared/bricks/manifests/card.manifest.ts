import { Type } from "@sinclair/typebox";
import { commonProps, commonStyleProps } from "../props/all";
import { defineBrickManifest, type StaticManifest } from "~/shared/brick-manifest";
import { padding } from "../props/layout";
import { backgroundColor } from "../props/background";

export const manifest = defineBrickManifest({
  type: "card",
  name: "Card",
  description: "A multi-purpose card that can have a title, subtitle, image, and content",
  repeatable: true,
  // svg icon for the "card" brick
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="11" x2="21" y2="11"></line><line x1="7" y1="14" x2="17" y2="14"></line>
        <line x1="7" y1="17" x2="15" y2="17"></line></svg>`,

  props: Type.Composite([
    commonProps,
    commonStyleProps,
    Type.Object({
      cardTitle: Type.Object(
        {
          content: Type.String({
            "ui:field": "hidden",
            "ui:group": "card-title",
            "ui:group:title": "Title",
            "ui:group:order": 0,
          }),
          padding,
          backgroundColor,
        },
        {
          title: "Title",
          "ui:group": "card-title",
          "ui:group:title": "Title",
          "ui:group:order": 0,
          default: "Edit my title",
        },
      ),
      cardImage: Type.Optional(
        Type.Object(
          {
            image: Type.String({
              title: "Image",
              "ui:field": "image",
              "ui:accept": "image/*",
              "ui:show-img-search": true,
            }),
          },
          {
            title: "Image",
            "ui:group": "card-image",
            "ui:group:title": "Image",
            "ui:group:order": 0,
          },
        ),
      ),
      cardBody: Type.Object(
        {
          content: Type.String({
            "ui:field": "hidden",
            "ui:group": "card-body",
            "ui:group:title": "Body",
            "ui:group:order": 0,
          }),
          padding,
          backgroundColor,
        },
        {
          title: "Body",
          "ui:group": "card-body",
          "ui:group:title": "Body",
          "ui:group:order": 0,
          default: {
            content: "Edit my content",
          },
        },
      ),
    }),
  ]),
});

export type Manifest = StaticManifest<typeof manifest>;
