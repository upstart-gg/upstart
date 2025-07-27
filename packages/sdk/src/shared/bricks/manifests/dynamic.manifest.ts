import { Type } from "@sinclair/typebox";
import { BsDatabaseDown } from "react-icons/bs";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { backgroundRef } from "../props/background";
import { borderRef, roundingRef } from "../props/border";
import { makeContainerProps } from "../props/container";
import { datasource } from "../props/datasource";
import { shadowRef } from "../props/effects";
import { defineProps } from "../props/helpers";
import { paddingRef } from "../props/padding";
import type { BrickProps } from "../props/types";
import { cssLengthRef } from "../props/css-length";
import { StringEnum } from "~/shared/utils/string-enum";

export const manifest = defineBrickManifest({
  type: "dynamic",
  category: "container",
  name: "Dynamic",
  description: "A dynamic container that fetches data from your database and constructs bricks from it.",
  isContainer: true,
  defaultWidth: {
    desktop: "auto",
    mobile: "100%",
  },
  defaultHeight: {
    desktop: "auto",
  },
  icon: BsDatabaseDown,
  props: defineProps({
    background: Type.Optional(backgroundRef()),
    alignItems: Type.Optional(
      StringEnum(["items-start", "items-center", "items-end", "items-stretch"], {
        enumNames: ["Start", "Center", "End", "Stretch"],
        default: "items-stretch",
        title: "Align bricks",
        description: "Align bricks",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:alignItems",
      }),
    ),
    gap: Type.Optional(
      cssLengthRef({
        title: "Gap",
        default: "10px",
        description: "Space between bricks.",
        "ai:instructions":
          "Can be a tailwind gap class like 'gap-1' or 'gap-2', or a custom value like '10px'",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:gap",
      }),
    ),
    padding: Type.Optional(
      paddingRef({
        default: "p-1",
      }),
    ),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(borderRef()),
    shadow: Type.Optional(shadowRef()),
    datasource: datasource(),
    ...makeContainerProps(),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [];
