import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, optional } from "../props/helpers";
import { background } from "../props/background";
import { datasourceRef } from "../props/datasource";
import { containerLayout, makeContainerProps } from "../props/container";
import { Type } from "@sinclair/typebox";
import { border } from "../props/border";
import { effects } from "../props/effects";
import { padding } from "../props/padding";
import { RxGrid } from "react-icons/rx";

export const datasource = Type.Array(Type.Object({}, { additionalProperties: true }));

// Generic container can hold any type of array data source
export const manifest = defineBrickManifest({
  type: "container",
  kind: "brick",
  name: "Container",
  description: "A container that can hold other bricks and align them horizontally or vertically",
  aiInstructions: `A container acts as a flexbox (default) or a grid and allows you to align bricks horizontally, vertically, or in a grid.
Here is an example of a container with a background image and padding, displaying a text and a image horizontaly:

\`\`\`json
{
"type": "container",
"props": {
  "preset": "bold-primary",
  "layout": {
    "direction": "row",
    "alignItems": "center",
    "justifyContent": "space-between"
  },
  "$children": [
    {
      "type": "text",
      "preset": "ghost",
      "props": {
        "content": "Hello World"
      }
    },
    {
      "type": "image",
      "props": {
        "src": "https://example.com/image.png",
        // [...]
      }
    }
  ]
}
\`\`\`
  `,
  isContainer: true,
  defaultHeight: {
    desktop: 6,
    mobile: 6,
  },
  defaultWidth: {
    desktop: 12,
    mobile: 12,
  },
  datasource,
  icon: RxGrid,
  props: defineProps({
    layout: containerLayout(),
    background: optional(background()),
    border: optional(border()),
    padding: optional(padding()),
    effects: optional(effects()),
    datasource: optional(datasourceRef()),
    ...makeContainerProps(),
  }),
});

export type Manifest = typeof manifest;
