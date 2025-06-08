import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional } from "../props/helpers";
import { TbCarouselHorizontal } from "react-icons/tb";
import { Type } from "@sinclair/typebox";
import { makeContainerProps } from "../props/container";
import type { BrickProps } from "../props/types";
import { background, backgroundRef } from "../props/background";
import { border, borderRef } from "../props/border";
import { padding, paddingRef } from "../props/padding";
import { effects, effectsRef } from "../props/effects";

export const manifest = defineBrickManifest({
  type: "carousel",
  kind: "widget",
  name: "Carousel",
  description: "A carousel element",
  isContainer: true,
  icon: TbCarouselHorizontal,
  props: defineProps({
    variants: Type.Array(
      Type.Union(
        [
          Type.Literal("pager-arrows", { title: "With arrows pager" }),
          Type.Literal("pager-numbers", { title: "With numbered pager" }),
          Type.Literal("pager-dots", { title: "With dots pager" }),
        ],
        {
          title: "Variant",
          description: "Carousel variants.",
        },
      ),
    ),
    background: optional(backgroundRef()),
    border: optional(borderRef),
    padding: optional(paddingRef),
    effects: optional(effectsRef()),
    ...makeContainerProps(),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "An image carousel with pager arrows",
    type: "carousel",
    props: {
      variants: ["pager-arrows"],
      $children: [
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/300x200.png?text=Image+1",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/300x200.png?text=Image+2",
          },
        },
        {
          type: "image",
          props: {
            src: "https://via.placeholder.com/300x200.png?text=Image+3",
          },
        },
      ],
    },
  },
  {
    description: "A carousel of text slides with numbered pager",
    type: "carousel",
    props: {
      variants: ["pager-numbers"],
      $children: [
        {
          type: "text",
          props: {
            content: "Slide 1",
            preset: "prominent-primary",
          },
        },
        {
          type: "text",
          props: {
            content: "Slide 2",
            preset: "prominent-secondary",
          },
        },
        {
          type: "text",
          props: {
            content: "Slide 3",
            preset: "prominent-accent",
          },
        },
      ],
    },
  },
];
