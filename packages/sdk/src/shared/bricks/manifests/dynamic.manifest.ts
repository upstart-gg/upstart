import { Type } from "@sinclair/typebox";
import { BsDatabaseDown } from "react-icons/bs";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { backgroundRef } from "../props/background";
import { borderRef } from "../props/border";
import { makeContainerProps } from "../props/container";
import { datasource } from "../props/datasource";
import { shadowRef } from "../props/effects";
import { defineProps } from "../props/helpers";
import { paddingRef } from "../props/padding";
import type { BrickProps } from "../props/types";

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
