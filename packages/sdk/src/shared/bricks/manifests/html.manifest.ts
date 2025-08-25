import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import type { BrickProps } from "../props/types";
import { BsCodeSquare } from "react-icons/bs";

import { Type } from "@sinclair/typebox";

export const manifest = defineBrickManifest({
  type: "html",
  name: "Html",
  category: "widgets",
  description:
    "A flexible brick that accepts HTML content. Useful for embeding custom HTML or third-party widgets.",
  aiInstructions:
    "Use only this brick type when integrating third party widgets or custom HTML content. Most of the time, you should use other bricks that are more secure and easier to use.",
  staticClasses: "self-stretch",
  defaultWidth: {
    mobile: "auto",
    desktop: "300px",
  },
  icon: BsCodeSquare,
  props: defineProps({
    html: Type.String({
      title: "HTML Content",
      description: "The HTML content to render. Use with caution, as it can introduce security risks.",
      default: "<div>Your HTML content here</div>",
      "ui:placeholder": "<div>Your HTML content here</div>",
      "ui:multiline": true,
      metadata: {
        category: "content",
      },
    }),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "A tally form",
    type: "html",
    props: {
      html: '<iframe data-tally-src="https://tally.so/embed/wQZpd8?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="282" frameborder="0" marginheight="0" marginwidth="0" title="test"></iframe>',
    },
  },
];
