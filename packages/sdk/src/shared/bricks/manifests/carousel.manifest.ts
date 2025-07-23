import { Type, type TObject } from "@sinclair/typebox";
import { TbCarouselHorizontal } from "react-icons/tb";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import { defineProps } from "../props/helpers";
import { imageRef } from "../props/image";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";

export const manifest = defineBrickManifest({
  type: "carousel",
  name: "Carousel",
  description: "An image carousel with navigation arrows and dots or numbers indicator",
  aiInstructions:
    "This brick should be used for image carousels with sliding functionality and navigation controls.",
  defaultInspectorTab: "content",
  isContainer: false,
  minHeight: {
    desktop: 200,
  },
  minWidth: {
    desktop: 300,
  },
  icon: TbCarouselHorizontal,
  props: defineProps({
    title: Type.Optional(Type.String({ title: "Title", metadata: { category: "content" } })),
    navigation: Type.Optional(
      Type.Union(
        [
          Type.Literal("pager-arrows", { title: "Only Arrows" }),
          Type.Literal("pager-numbers", { title: "Numbered" }),
          Type.Literal("pager-dots", { title: "Dots" }),
        ],
        {
          title: "Navigation",
          description: "Navigation style.",
          default: "pager-dots",
        },
      ),
    ),
    staticImages: Type.Optional(
      Type.Array(
        Type.Object({
          src: imageRef({
            "ui:responsive": "desktop",
            "ui:no-alt-text": true,
            "ui:no-object-options": true,
          }),
          legend: string("Legend"),
        }),
        {
          title: "Images",
          default: [],
          maxItems: 12,
          metadata: {
            category: "content",
            filter: (manifestProps: TObject, formData: Manifest["props"]) => {
              return formData.useDatabase === false;
            },
          },
        },
      ),
    ),
    borderRadius: Type.Optional(
      StringEnum(["rounded-none", "rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-full"], {
        enumNames: ["None", "Small", "Medium", "Large", "Extra large", "Full"],
        title: "Border",
        description: "Rounded corners for images",
        default: "rounded-md",
      }),
    ),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "An image carousel with title and legends",
    type: "carousel",
    props: {
      title: "Featured Images",
      navigation: "pager-dots",
      staticImages: [
        {
          src: {
            src: "https://via.placeholder.com/800x400.png?text=Slide+1",
            alt: "First slide",
          },
          legend: "Beautiful landscape",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x400.png?text=Slide+2",
            alt: "Second slide",
          },
          legend: "Amazing architecture",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x400.png?text=Slide+3",
            alt: "Third slide",
          },
          legend: "Stunning nature",
        },
      ],
    },
  },
];
