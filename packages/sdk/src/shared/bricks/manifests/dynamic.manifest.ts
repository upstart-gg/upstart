import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { backgroundRef } from "../props/background";
import { makeContainerProps } from "../props/container";
import { Type } from "@sinclair/typebox";
import { borderRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { paddingRef } from "../props/padding";
import type { BrickProps } from "../props/types";
import { BsDatabaseDown } from "react-icons/bs";

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
    desktop: "380px",
  },
  icon: BsDatabaseDown,
  props: defineProps({
    background: Type.Optional(backgroundRef()),
    border: Type.Optional(borderRef()),
    padding: Type.Optional(paddingRef()),
    shadow: Type.Optional(shadowRef()),
    ...makeContainerProps(),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [];
